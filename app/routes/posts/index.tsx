import { Link, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

export const loader = async () => {
  const data = {
    posts: await db.post.findMany({
      take: 20,
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  };

  return data;
};

export interface Post {
  id: number;
  title: string;
  body: string;
  createdAt: Date
  updatedAt: Date
}

function PostItems() {
  const { posts } = useLoaderData();

  return (
    <>
      <div className="page-header">
        <h1>Posts</h1>
        <Link to="/posts/new" className="btn">
          New Post
        </Link>
      </div>
      <ul className="posts-list">
        {posts.map((post: Post) => (
          <li key={post.id}>
            <Link to={post.id.toString()}>
              <h3>{post.title}</h3>
              {new Date(post.createdAt).toLocaleString("en-gb")}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default PostItems;
