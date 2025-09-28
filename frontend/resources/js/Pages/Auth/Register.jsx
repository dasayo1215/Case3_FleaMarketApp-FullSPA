import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/GuestLayout";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/register");
    };

    return (
        <div className="content-wrapper">
            <h2 className="content-heading">会員登録</h2>
            <form className="content-form-wrapper" onSubmit={handleSubmit}>
                {/* ユーザー名 */}
                <label className="content-form-label" htmlFor="name">
                    ユーザー名
                </label>
                <input
                    className="content-form-input form-control"
                    type="text"
                    name="name"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                />
                {errors.name && <p className="form-error">{errors.name}</p>}

                {/* メールアドレス */}
                <label className="content-form-label" htmlFor="email">
                    メールアドレス
                </label>
                <input
                    className="content-form-input form-control"
                    type="text"
                    name="email"
                    id="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                />
                {errors.email && <p className="form-error">{errors.email}</p>}

                {/* パスワード */}
                <label className="content-form-label" htmlFor="password">
                    パスワード
                </label>
                <input
                    className="content-form-input"
                    type="password"
                    name="password"
                    id="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                />
                {errors.password && (
                    <p className="form-error">{errors.password}</p>
                )}

                {/* 確認用パスワード */}
                <label
                    className="content-form-label"
                    htmlFor="password_confirmation"
                >
                    確認用パスワード
                </label>
                <input
                    className="content-form-input"
                    type="password"
                    name="password_confirmation"
                    id="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                />
                {errors.password_confirmation && (
                    <p className="form-error">{errors.password_confirmation}</p>
                )}

                <input
                    className="content-form-btn"
                    type="submit"
                    value={processing ? "処理中..." : "登録する"}
                    disabled={processing}
                />
            </form>

            <Link className="content-btn" href="/login">
                ログインはこちら
            </Link>
        </div>
    );
}

// Blade の @extends('layouts.app') 相当
Register.layout = (page) => <AppLayout title="会員登録">{page}</AppLayout>;
