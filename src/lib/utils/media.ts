export function getMediaType(url: string): 'IMAGE' | 'VIDEO' {
  const extension = url.split('.').pop()?.toLowerCase();
  if (['mp4', 'mov', 'avi', 'webm'].includes(extension || '')) {
    return 'VIDEO';
  }
  return 'IMAGE';
}