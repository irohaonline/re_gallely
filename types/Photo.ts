import Tag from "./Tag";
import User from "./User";

type Photo = {
  id: string;
  tag:Tag;
  url: string;
  thumbnailURL: string;
  createdAt: Date;
  owner: User;
};

export default Photo;
