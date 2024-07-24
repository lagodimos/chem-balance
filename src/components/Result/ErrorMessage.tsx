interface Props {
    children: string;
}

function ErrorMessage({ children }: Props) {
    return <p className="m-5 display-4 text-danger">{children}</p>;
}

export default ErrorMessage;
