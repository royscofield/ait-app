import React from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import { persistor, store } from "../public/redux/store"
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "styles/globals.css";
import { PageLoading } from "public/shared";

Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`);
  document.body.classList.add("body-page-transition");
  ReactDOM.render(
    <PageLoading/>,
    document.getElementById("page-transition")
  );
});
Router.events.on("routeChangeComplete", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});

export default class MyApp extends App {
  componentDidMount() {
    let comment = document.createComment(`AIT Lucky App`);
    document.insertBefore(comment, document.documentElement);
  }
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }
  render() {
    const { Component, pageProps } = this.props;

    const Layout = Component.layout || (({ children }) => <>{children}</>);

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <React.Fragment>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
              />
              <link rel="shortcut icon" href="/img/favicon/favicon.ico" />
              <link rel="apple-touch-icon" sizes="180x180" href="/img/favicon/apple-touch-icon.png" />
              <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon/favicon-32x32.png"/>
              <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon/favicon-16x16.png"/>
              <title>AIT Lucky App</title>
              <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE"></script>
            </Head>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </React.Fragment>
        </PersistGate>
      </Provider>
    );
  }
}
