export enum ContentType {
  CHALLANGE = 'challenge',
  CLASSROOM = 'classroom',
  LIVE = 'live',
  VIDEO = 'video',
}

export enum UserClassStatus {
  JOINED = 'joined',
  STARTED = 'started',
  COMPLETED = 'completed',
}

const getContentType: (SK: string) => ContentType = SK => {
  if (SK.includes('CHALLANGE')) {
    return ContentType.CHALLANGE;
  } else if (SK.includes('CLASSROOM')) {
    return ContentType.CLASSROOM;
  } else if (SK.includes('LIVE')) {
    return ContentType.LIVE;
  } else if (SK.includes('VIDEOS')) {
    return ContentType.VIDEO;
  }
  return ContentType.CLASSROOM;
}

export {
  getContentType
}
