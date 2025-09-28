import React, { useMemo } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import "../../css/common.css";
import "../../css/sanitize.css";
import { route } from "ziggy-js";
import { Ziggy } from "@/ziggy";

export default function AppLayout({ children, title, extraHead = null }) {
    const { auth, page } = usePage().props ?? {};
    const isLoggedIn = Boolean(auth?.user);

    const onLogout = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    return (
        <div className="min-h-screen">
            {/* Head 相当 */}
            <Head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>{title ?? "COACHTECH"}</title>
                {/* ページ固有の追加 <link> 等は extraHead で受け取る */}
                {extraHead}
            </Head>

            {/* header */}
            <header className="header">
                <div className="header-wrapper">
                    <h1 className="sr-only">COACHTECH</h1>
                    <Link
                        className="header-logo"
                        href={route("index", {}, false, Ziggy)}
                    >
                        <img
                            className="header-logo-img"
                            src="/storage/assets/logo.svg"
                            alt="ロゴ"
                        />
                    </Link>

                    <ul className="header-nav">
                        <li className="header-nav-search">
                            {/* Blade の検索フォームをそのまま GET に */}
                            <form
                                className="header-nav-search-form form-control"
                                action={route("index", {}, false, Ziggy)}
                                method="GET"
                            >
                                <input
                                    className="header-nav-search-input form-control"
                                    type="text"
                                    name="keyword"
                                    placeholder="なにをお探しですか？"
                                    defaultValue={
                                        typeof window !== "undefined"
                                            ? new URLSearchParams(
                                                    window.location.search
                                                ).get("keyword") ?? ""
                                            : ""
                                    }
                                />
                                <input
                                    type="hidden"
                                    name="page"
                                    value={page ?? ""}
                                />
                                <button
                                    className="header-nav-search-btn"
                                    type="submit"
                                >
                                    検索
                                </button>
                            </form>
                        </li>

                        {isLoggedIn ? (
                            <li className="header-nav-item">
                                {/* Inertia で POST /logout */}
                                <form
                                    className="header-nav-auth-form"
                                    onSubmit={onLogout}
                                >
                                    <button
                                        className="header-nav-auth-btn"
                                        type="submit"
                                    >
                                        ログアウト
                                    </button>
                                </form>
                            </li>
                        ) : (
                            <li className="header-nav-item">
                                <Link
                                    className="header-nav-auth-btn"
                                    href={route("login", {}, false, Ziggy)}
                                >
                                    ログイン
                                </Link>
                            </li>
                        )}

                        <li className="header-nav-item">
                            <Link
                                className="header-nav-mypage"
                                href={route("mypage", {}, false, Ziggy)}
                            >
                                マイページ
                            </Link>
                        </li>
                        <li className="header-nav-item">
                            <Link
                                className="header-nav-sale"
                                href={route("sell", {}, false, Ziggy)}
                            >
                                出品
                            </Link>
                        </li>
                    </ul>
                </div>
            </header>

            {/* content */}
            <div className="content">{children}</div>

            {/* Blade の @yield('scripts') 相当：各ページ側で <Head> か extraHead を使って読み込むのが一般的 */}
        </div>
    );
}
