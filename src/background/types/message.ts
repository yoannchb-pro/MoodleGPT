export enum ROLE {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant'
}

export enum CONTENT_TYPE {
  TEXT = 'text',
  IMAGE = 'image_url'
}

export type MessageContent =
  | string
  | Array<
      | {
          type: CONTENT_TYPE.TEXT;
          text: string;
        }
      | {
          type: CONTENT_TYPE.IMAGE;
          image_url: { url: string };
        }
    >;

export type Message = {
  role: ROLE;
  content: MessageContent;
};
