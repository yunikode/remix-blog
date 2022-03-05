import { Link, redirect, useActionData, json } from "remix";
import { db } from "~/utils/db.server";

function validate(text: string, type: string, length: number) {
  if (typeof text != "string" || text.length < length) {
    return `${type} should be at least ${length} characters long`;
  }
}

export const action = async ({ request }: any) => {
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");

  const fields = {
    title,
    body,
  };

  const fieldErrors = {
    title: validate(title, "Title", 3),
    body: validate(body, "Body", 10),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return json({ fieldErrors, fields }, { status: 400 });
  }

  const post = await db.post.create({ data: fields });

  return redirect(`/posts/${post.id}`);
};

function NewPost() {
  const actionData = useActionData();
  return (
    <>
      <div className="page-header">
        <h1>New Post</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              defaultValue={actionData?.fields?.title}
            />
            <div className="error">
              <p>{actionData?.fieldErrors?.title}</p>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="body">Post Body</label>
            <textarea id="body" name="body" defaultValue={actionData?.fields?.body}/>
            <div className="error">
              <p>{actionData?.fieldErrors?.body}</p>
            </div>
          </div>
          <button className="btn btn-block" type="submit">
            Add Post
          </button>
        </form>
      </div>
    </>
  );
}

export default NewPost;
