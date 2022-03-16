export const NUM = {
  VIDEO_ITEMS_UNIT: 10,
  MAX_STORAGE_LENGTH: 100,
  TOAST_DELAY: 2000,
};

export const LOCAL_DB = {
  VIDEO_ID: "videoId",
};

export const ERROR_MESSAGES = {
  DUPLICATE_DATA: "저장소에 이미 존재하는 데이터입니다!",
  FULL_STORAGE: `저장소 공간이 꽉찼습니다! (최대 저장 가능 개수: ${NUM.MAX_STORAGE_LENGTH})`,
  EXCEED_API: "API 한도가 초과되었습니다. 나중에 다시 시도하세요.",
  CANNOT_CONNECT: "네트워크 에러가 발생했습니다. 나중에 다시 시도하세요.",
};
