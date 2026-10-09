// app/admin/bulk-sms/page.tsx
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Upload, Trash2, Search, Send, Copy, Check, AlertCircle, UserPlus, Pencil, Cake } from 'lucide-react';

interface SmsContact {
  id: string;
  name: string;
  phone: string;
  birthday?: string | null;
  source: 'import' | 'manual';
  createdAt: string | { seconds: number };
}

const SMS_SEGMENT_LENGTH = 160;

function parseCsv(text: string): { name: string; phone: string; birthday?: string }[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const rows: { name: string; phone: string; birthday?: string }[] = [];
  for (const line of lines) {
    if (/^name\s*,\s*phone/i.test(line.trim())) continue; // header row
    const parts = line.split(',').map((p) => p.trim());
    const [name, phone, birthday] = parts;
    if (!phone) continue;
    rows.push({ name: name || '', phone, ...(birthday ? { birthday } : {}) });
  }
  return rows;
}

function formatBirthday(birthday?: string | null) {
  if (!birthday) return null;
  const match = birthday.match(/^\d{4}-(\d{2})-(\d{2})/);
  if (!match) return birthday;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[Number(match[1]) - 1]} ${Number(match[2])}`;
}

export default function BulkSmsPage() {
  const { user, isAdmin, loading: authLoading, firebaseUser } = useAuth();
  const router = useRouter();

  const [contacts, setContacts] = useState<SmsContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const [fallbackName, setFallbackName] = useState('there');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ ok: boolean; text: string; recipients?: string[] } | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add/edit contact dialog — same form for both; editingId null means "new".
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formBirthday, setFormBirthday] = useState('');
  const [savingContact, setSavingContact] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Birthday autosend settings.
  const [birthdayEnabled, setBirthdayEnabled] = useState(false);
  const [birthdayTemplate, setBirthdayTemplate] = useState('');
  const [birthdayFallbackName, setBirthdayFallbackName] = useState('friend');
  const [birthdaySaving, setBirthdaySaving] = useState(false);
  const [birthdaySaved, setBirthdaySaved] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin && firebaseUser && !authLoading) {
      fetchContacts();
      fetchBirthdaySettings();
    }
  }, [user, isAdmin, firebaseUser, authLoading]);

  const authedFetch = async (url: string, init?: RequestInit) => {
    const token = await firebaseUser!.getIdToken();
    return fetch(url, {
      ...init,
      headers: { ...init?.headers, Authorization: `Bearer ${token}` },
    });
  };

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authedFetch('/api/admin/sms-contacts');
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Failed: ${res.status}`);
      setContacts(await res.json());
    } catch (err: any) {
      setError(err?.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const fetchBirthdaySettings = async () => {
    try {
      const res = await authedFetch('/api/admin/sms/birthday-settings');
      if (!res.ok) return;
      const data = await res.json();
      setBirthdayEnabled(data.enabled);
      setBirthdayTemplate(data.template);
      setBirthdayFallbackName(data.fallbackName || 'friend');
    } catch {
      // Non-critical — the card just falls back to its default state.
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q));
  }, [contacts, search]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.id));

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllFiltered = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filtered.forEach((c) => next.delete(c.id));
      } else {
        filtered.forEach((c) => next.add(c.id));
      }
      return next;
    });
  };

  // Explicit "every contact" controls — distinct from the header checkbox,
  // which only selects whatever the current search matches.
  const selectAllContacts = () => setSelected(new Set(contacts.map((c) => c.id)));
  const clearSelection = () => setSelected(new Set());

  const deleteContact = async (id: string) => {
    const prev = contacts;
    setContacts((cs) => cs.filter((c) => c.id !== id));
    const res = await authedFetch(`/api/admin/sms-contacts/${id}`, { method: 'DELETE' });
    if (!res.ok) setContacts(prev); // revert on failure
  };

  const openAddDialog = () => {
    setEditingId(null);
    setFormName('');
    setFormPhone('');
    setFormBirthday('');
    setFormError(null);
    setContactDialogOpen(true);
  };

  const openEditDialog = (c: SmsContact) => {
    setEditingId(c.id);
    setFormName(c.name || '');
    setFormPhone(c.phone);
    setFormBirthday(c.birthday || '');
    setFormError(null);
    setContactDialogOpen(true);
  };

  const saveContact = async () => {
    setSavingContact(true);
    setFormError(null);
    try {
      const res = await authedFetch('/api/admin/sms-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, phone: formPhone, birthday: formBirthday || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save contact');
      setContactDialogOpen(false);
      await fetchContacts();
    } catch (err: any) {
      setFormError(err?.message || 'Could not save contact');
    } finally {
      setSavingContact(false);
    }
  };

  const runImport = async (rows: { name: string; phone: string; birthday?: string }[]) => {
    setImporting(true);
    setImportResult(null);
    try {
      const res = await authedFetch('/api/admin/sms-contacts/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');
      setImportResult(`Imported ${data.imported} contact${data.imported === 1 ? '' : 's'}${data.skipped ? ` · skipped ${data.skipped} with no phone number` : ''}.`);
      await fetchContacts();
    } catch (err: any) {
      setImportResult(`Error: ${err?.message || 'Import failed'}`);
    } finally {
      setImporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    await runImport(parseCsv(text));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePasteImport = async () => {
    const rows = parseCsv(importText);
    if (rows.length === 0) {
      setImportResult('No rows found — expecting "Name,Phone" (optionally ",Birthday") per line.');
      return;
    }
    await runImport(rows);
    setImportText('');
  };

  const selectedCount = selected.size;
  const segments = Math.max(1, Math.ceil(message.length / SMS_SEGMENT_LENGTH));
  const usesPersonalization = /\{name\}/i.test(message);
  const firstSelectedName = useMemo(() => {
    const first = contacts.find((c) => selected.has(c.id));
    return first?.name || fallbackName || 'there';
  }, [contacts, selected, fallbackName]);
  const selectedWithNoName = useMemo(
    () => Array.from(selected).filter((id) => !contacts.find((c) => c.id === id)?.name).length,
    [contacts, selected]
  );

  const sendSms = async () => {
    setSending(true);
    setSendResult(null);
    try {
      const res = await authedFetch('/api/admin/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactIds: Array.from(selected), message, fallbackName }),
      });
      const data = await res.json();
      if (data.configured === false) {
        setSendResult({
          ok: false,
          text: 'No SMS provider is connected yet, so this couldn’t be sent automatically. Copy the numbers below and paste them into your SMS platform for now.',
          recipients: data.recipients,
        });
        return;
      }
      if (!res.ok || !data.ok) throw new Error(data.error || 'Send failed');
      setSendResult({ ok: true, text: `Sent to ${data.recipientCount} recipient${data.recipientCount === 1 ? '' : 's'}.` });
      setMessage('');
      setSelected(new Set());
    } catch (err: any) {
      setSendResult({ ok: false, text: err?.message || 'Send failed' });
    } finally {
      setSending(false);
    }
  };

  const copyRecipients = async (numbers: string[]) => {
    try {
      await navigator.clipboard.writeText(numbers.join(', '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing to recover gracefully here
    }
  };

  const saveBirthdaySettings = async () => {
    setBirthdaySaving(true);
    try {
      const res = await authedFetch('/api/admin/sms/birthday-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: birthdayEnabled, template: birthdayTemplate, fallbackName: birthdayFallbackName }),
      });
      if (!res.ok) throw new Error('Save failed');
      setBirthdaySaved(true);
      setTimeout(() => setBirthdaySaved(false), 2000);
    } catch {
      // The Save button itself shows no error state here — acceptable for
      // a low-stakes settings toggle; a retry click is the recovery path.
    } finally {
      setBirthdaySaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-700" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bulk SMS</h1>
          <p className="text-gray-600 mt-2">Manage your SMS contact list and send messages to clients.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 px-3 py-1">{contacts.length} contacts</Badge>
          <Button onClick={openAddDialog} variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
          <Button onClick={() => setImportOpen(true)} variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-red-200">
          <CardContent className="py-4 flex items-center gap-3 text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-lg">Contacts</CardTitle>
              <div className="relative w-56">
                <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or phone" className="pl-8 h-9" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 pt-1 text-sm">
              <span className="text-gray-600">
                {selectedCount > 0 ? `${selectedCount} selected` : 'None selected'}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={selectAllContacts}
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Select all {contacts.length} contacts
                </button>
                {selectedCount > 0 && (
                  <button type="button" onClick={clearSelection} className="text-gray-500 hover:text-gray-700">
                    Clear
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No contacts yet — import a CSV or add one to get started.</p>
            ) : (
              <div className="max-h-[520px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox checked={allFilteredSelected} onCheckedChange={toggleAllFiltered} aria-label="Select all" />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Birthday</TableHead>
                      <TableHead className="w-20" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          <Checkbox checked={selected.has(c.id)} onCheckedChange={() => toggleOne(c.id)} aria-label={`Select ${c.name || c.phone}`} />
                        </TableCell>
                        <TableCell className="font-medium">{c.name || <span className="text-gray-400">—</span>}</TableCell>
                        <TableCell className="font-mono text-sm text-gray-600">+{c.phone}</TableCell>
                        <TableCell className="text-sm text-gray-600">{formatBirthday(c.birthday) || <span className="text-gray-300">—</span>}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(c)} aria-label="Edit contact">
                              <Pencil className="h-4 w-4 text-gray-400 hover:text-gray-700" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteContact(c.id)} aria-label="Delete contact">
                              <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="h-fit lg:sticky lg:top-20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Compose message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi {name}, your photos are ready to view..."
                rows={6}
              />
              <p className="text-xs text-gray-500">
                Use <code className="bg-gray-100 px-1 py-0.5 rounded">{'{name}'}</code> to personalize — leave it out to send the same text to everyone.
                {usesPersonalization && selectedCount > 0 && (
                  <span className="block mt-1 text-gray-600">Preview: &ldquo;{message.replace(/\{name\}/gi, firstSelectedName)}&rdquo;</span>
                )}
              </p>
              {usesPersonalization && (
                <div>
                  <Label htmlFor="fallback-name" className="text-xs text-gray-600">
                    Greeting for contacts with no name on file{selectedWithNoName > 0 && ` (${selectedWithNoName} of your selected contacts)`}
                  </Label>
                  <Input
                    id="fallback-name"
                    value={fallbackName}
                    onChange={(e) => setFallbackName(e.target.value)}
                    placeholder="there"
                    className="mt-1.5 h-9"
                  />
                </div>
              )}
              <div className="flex justify-between text-xs text-gray-500">
                <span>{message.length} characters · {segments} segment{segments === 1 ? '' : 's'}</span>
                <span>{selectedCount} recipient{selectedCount === 1 ? '' : 's'} selected</span>
              </div>
              <Button onClick={sendSms} disabled={sending || selectedCount === 0 || !message.trim()} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                {sending ? 'Sending…' : 'Send SMS'}
              </Button>

              {sendResult && (
                <div className={`rounded-md p-3 text-sm ${sendResult.ok ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-900'}`}>
                  <p>{sendResult.text}</p>
                  {sendResult.recipients && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => copyRecipients(sendResult.recipients!)}
                    >
                      {copied ? <Check className="h-3.5 w-3.5 mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
                      {copied ? 'Copied' : `Copy ${sendResult.recipients.length} numbers`}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Cake className="h-4 w-4 text-gray-500" />
                <CardTitle className="text-lg">Birthday Autosend</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="birthday-enabled" className="text-sm text-gray-700">
                  Automatically text contacts on their birthday
                </Label>
                <Switch id="birthday-enabled" checked={birthdayEnabled} onCheckedChange={setBirthdayEnabled} />
              </div>
              <Textarea
                value={birthdayTemplate}
                onChange={(e) => setBirthdayTemplate(e.target.value)}
                placeholder="Happy birthday, {name}! 🎉"
                rows={3}
              />
              <div>
                <Label htmlFor="birthday-fallback" className="text-xs text-gray-600">
                  Greeting for contacts with no name on file
                </Label>
                <Input
                  id="birthday-fallback"
                  value={birthdayFallbackName}
                  onChange={(e) => setBirthdayFallbackName(e.target.value)}
                  placeholder="friend"
                  className="mt-1.5 h-9"
                />
              </div>
              <p className="text-xs text-gray-500">
                Runs once a day. Only contacts with a birthday saved (edit a contact to add one) and matching today's date get a message — each contact is wished once per year.
              </p>
              <Button onClick={saveBirthdaySettings} disabled={birthdaySaving || !birthdayTemplate.trim()} variant="outline" className="w-full">
                {birthdaySaving ? 'Saving…' : birthdaySaved ? 'Saved' : 'Save birthday settings'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Import contacts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Upload a CSV with "Name,Phone" per line — add a third column, "Name,Phone,Birthday" (YYYY-MM-DD), to include birthdays too:
              </p>
              <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={handleFileChange} disabled={importing} />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">or paste</span>
              </div>
            </div>
            <Textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={'Name,Phone,Birthday\nKemi Mensah,233207342441,1996-04-12'}
              rows={6}
              disabled={importing}
            />
            {importResult && <p className="text-sm text-gray-700">{importResult}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportOpen(false)}>
              Close
            </Button>
            <Button onClick={handlePasteImport} disabled={importing || !importText.trim()}>
              {importing ? 'Importing…' : 'Import pasted rows'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit contact' : 'Add contact'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="contact-name" className="text-sm">Name</Label>
              <Input id="contact-name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Kemi Mensah" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="contact-phone" className="text-sm">Phone</Label>
              <Input id="contact-phone" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="0207342441" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="contact-birthday" className="text-sm">Birthday (optional)</Label>
              <Input id="contact-birthday" type="date" value={formBirthday} onChange={(e) => setFormBirthday(e.target.value)} className="mt-1.5" />
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveContact} disabled={savingContact || !formPhone.trim()}>
              {savingContact ? 'Saving…' : editingId ? 'Save changes' : 'Add contact'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
