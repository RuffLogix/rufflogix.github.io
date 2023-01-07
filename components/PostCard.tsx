import { FunctionComponent } from "react";
import { IPost } from "../interfaces/IPost";
import Link from "next/link";
import moment from "moment";

interface Props {
    post: IPost,
}

const PostCard: FunctionComponent<Props> = ({ post }) => {
    const { title, author, tags, slug, date } = post;
    const url = '/post/' + slug;

    return (
        <div className='flex flex-col w-full gap-5'>
            <div className="flex flex-col gap-1">
                <div className="flex gap-1 items-baseline"> 
                    <h1 className=''><b>{title}</b></h1>
                    <h1 className="h-fit text-xs text-gray-400">
                        <Link href="/about" legacyBehavior>
                            <a href="/about"> 
                                @{author}
                            </a>
                        </Link>
                    </h1>
                </div>
                <div className="flex gap-1 items-center">
                    <h1 className="text-sm">{ date } ({ moment(date).fromNow()})</h1>
                    <div className="flex gap-1">{
                        tags.map((tag, idx) => {
                            return <p className="px-3 border-dashed border-x-2 border-y-2 rounded-lg text-sm" key={ idx }>{ tag }</p>
                        })
                    }</div>
                </div>
            </div>
            <Link href={ url }  legacyBehavior>
                <a className='bg-black text-white text-sm px-3 py-1 w-fit rounded-md hover:underline' href={ url }> Read more... </a>
            </Link>
        </div>
    )
}

export default PostCard;