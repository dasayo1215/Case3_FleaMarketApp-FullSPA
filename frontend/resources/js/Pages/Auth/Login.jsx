import React from "react";
import { useForm, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/GuestLayout";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login"); // LoginController@login にPOST
    };

    return (
        <div className="content-wrapper">
            <h2 className="content-heading">ログイン</h2>
            <form className="content-form-wrapper" onSubmit={handleSubmit}>
                {/* Email */}
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

                {/* Password */}
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

                <input
                    className="content-form-btn"
                    type="submit"
                    value={processing ? "処理中..." : "ログインする"}
                    disabled={processing}
                />
            </form>

            <Link className="content-btn" href="/register">
                会員登録はこちら
            </Link>
        </div>
    );
}

// Bladeの @extends('layouts.app') 相当
Login.layout = (page) => <AppLayout title="ログイン">{page}</AppLayout>;
