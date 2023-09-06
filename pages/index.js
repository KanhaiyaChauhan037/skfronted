import Login from "@/components/Login";
import Head from "next/head";

export default function Home() {
  <Head>
    <meta charSet="utf-8" />
    <meta name="author" content="Softnio" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta
      name="description"
      content="A powerful and conceptual apps base dashboard."
    />
    {/* Fav Icon  */}
    <link rel="shortcut icon" href="images/favicon.png" />
    {/* Page Title  */}
    <title>Login</title>
    {/* StyleSheets  */}
    <link rel="stylesheet" href="assets/css/dashlite.css?ver=3.1.2" />
    <link
      id="skin-default"
      rel="stylesheet"
      href="assets/css/theme.css?ver=3.1.2"
    />
  </Head>;
  return (
    <>
       <Login/>
    </>
  );
}
