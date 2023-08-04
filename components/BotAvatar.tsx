import { Avatar, AvatarImage } from "./ui/avatar";

interface IProps {
    src: string;
}

const BotAvatar = ({ src }: IProps) => {
    return (
        <Avatar className="h-12 w-12">
            <AvatarImage src={src} />
        </Avatar>
    );
};

export default BotAvatar;
