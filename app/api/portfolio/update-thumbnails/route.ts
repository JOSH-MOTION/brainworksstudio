import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export async function POST() {
  try {
    const querySnapshot = await getDocs(collection(db, 'portfolio'));
    for (const docSnapshot of querySnapshot.docs) {
      const item = docSnapshot.data();
      if (item.videoUrl && (!item.imageUrls || item.imageUrls.length === 0)) {
        let thumbnailUrl = '/video-placeholder.jpg';
        if (item.videoUrl.includes('youtube.com') || item.videoUrl.includes('youtu.be')) {
          const videoId = item.videoUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1];
          thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : thumbnailUrl;
        }
        console.log(`Updating ${item.title}: setting imageUrls to [${thumbnailUrl}]`);
        await updateDoc(doc(db, 'portfolio', docSnapshot.id), { imageUrls: [thumbnailUrl] });
      }
    }
    return new Response('Thumbnails updated', { status: 200 });
  } catch (error) {
    console.error('Error updating thumbnails:', error);
    return new Response('Failed to update thumbnails', { status: 500 });
  }
}