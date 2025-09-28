import React from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import "../../../css/auth/verify-email.css";

export default function VerifyEmail() {
    const { post, processing } = useForm({});
    const { flash } = usePage().props; // Laravel 側の session()->flash('message') を受け取れる

    const handleResend = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <div className="content-wrapper-small">
            {/* フラッシュメッセージ */}
            {flash?.message && (
                <div className="verify-text message">{flash.message}</div>
            )}

            {/* 説明テキスト */}
            <div className="verify-text">メール認証を完了してください。</div>

            {/* リンクは説明文の直下に配置 */}
            <div className="verify-link-wrapper">
                <a className="mail-link" href="http://localhost:8025/">
                    認証はこちらから
                </a>
            </div>

            {/* 再送ボタン */}
            <form className="content-form" onSubmit={handleResend}>
                <button
                    className="content-btn"
                    type="submit"
                    disabled={processing}
                >
                    {processing ? "送信中..." : "認証メールを再送する"}
                </button>
            </form>
        </div>
    );
}

// レイアウト適用（ゲスト用）
VerifyEmail.layout = (page) => (
    <GuestLayout title="メール認証">{page}</GuestLayout>
);
