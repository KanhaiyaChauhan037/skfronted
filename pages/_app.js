import "@/public/assets/css/dashlite.css";
import { Provider } from "react-redux";
import store from "@/store/ReduxStore";
import Head from "next/head";
import ToastContainerComp from "@/utils/ToastContainer";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="./images/favicon.png" />
        <title>Dashboard</title>
        <link rel="stylesheet" href="/assets/css/dashlite.css?ver=3.1.2" />
        <link
          id="skin-default"
          rel="stylesheet"
          href="/assets/css/theme.css?ver=3.1.2"
        />
      </Head>
      <Provider store={store}>
        <ToastContainerComp />
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
