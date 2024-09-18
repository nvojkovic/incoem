import Intercom from "@intercom/messenger-js-sdk";

interface IntercomProps {
  children: any;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: number;
    hash: string;
  };
}

export default function IntercomMessanger({ children, user }: IntercomProps) {
  Intercom({
    app_id: "l67jrbzl",
    user_id: user.id, // IMPORTANT: Replace "user.id" with the variable you use to capture the user's ID
    name: user.name, // IMPORTANT: Replace "user.name" with the variable you use to capture the user's name
    email: user.email,
    // IMPORTANT: Replace "user.email" with the variable you use to capture the user's email
    created_at: user.createdAt,
    user_hash: user.hash,
    // // IMPORTANT: Replace "user.createdAt" with the variable you use to capture the user's sign-up date in a Unix timestamp (in seconds) e.g. 1704067200
  });
  return <div>{children}</div>;
}
