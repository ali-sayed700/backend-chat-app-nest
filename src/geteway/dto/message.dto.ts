export class MessageDto {
  user_id: string;
  text: string;
  images: string[];
  room_id: string;
  user: {
    username: string;
  };
}
