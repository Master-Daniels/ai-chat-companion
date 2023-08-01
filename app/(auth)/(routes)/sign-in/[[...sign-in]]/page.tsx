import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
    <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        appearance={{
            elements: {
                socialButtons: "flex items-center justify-between",
                formButtonPrimary: "bg-slate-500 hover:bg-slate-400 text-sm normal-case",
            },
        }}
    />
);

export default SignInPage;
