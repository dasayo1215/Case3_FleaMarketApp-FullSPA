// resources/js/Pages/Users/Edit.jsx
import React, { useState } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import "../../../css/users/edit.css";

export default function Edit() {
    const { auth, errors } = usePage().props;
    const user = auth.user;

    const { data, setData, patch, processing } = useForm({
        name: user.name || "",
        postal_code: user.postal_code || "",
        address: user.address || "",
        building: user.building || "",
        profile_uploaded_image_path: "",
    });

    const [imageUrl, setImageUrl] = useState(
        user.image_filename
            ? `/storage/users/${user.image_filename}?v=${Date.now()}`
            : `/storage/assets/default.png`
    );
    const [imageError, setImageError] = useState("");

    // プロフィール更新
    const handleSubmit = (e) => {
        e.preventDefault();
        patch("/mypage/profile");
    };

    // 非同期画像アップロード
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append(
            "_token",
            document.querySelector('meta[name="csrf-token"]').content
        );
        formData.append("image", file);

        try {
            const response = await fetch("/mypage/profile/image", {
                method: "POST",
                body: formData,
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });

            const result = await response.json();
            if (result.success) {
                setImageUrl(result.image_url + "?v=" + Date.now());
                setData("profile_uploaded_image_path", result.path);
                setImageError("");
            } else if (result.errors?.image) {
                setImageError(result.errors.image.join("\n"));
            } else {
                setImageError("画像のアップロードに失敗しました");
            }
        } catch (err) {
            setImageError("通信エラーが発生しました");
        }
    };

    return (
        <AppLayout title="プロフィール設定">
            <div className="content-wrapper">
                

                <div className="image-wrapper">
                    <img
                        id="profile-image"
                        className="image-circle"
                        src={imageUrl}
                        alt="profile"
                    />
                    <label className="image-label" htmlFor="image">
                        画像を選択する
                    </label>
                    <input
                        className="image-input-hidden"
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                    />
                </div>
                {imageError && (
                    <p className="form-error image-error">{imageError}</p>
                )}

                <form className="content-form-wrapper" onSubmit={handleSubmit}>
                    <label className="content-form-label" htmlFor="name">
                        ユーザー名
                    </label>
                    <input
                        className="content-form-input"
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                    />
                    {errors.name && <p className="form-error">{errors.name}</p>}

                    <label className="content-form-label" htmlFor="postal_code">
                        郵便番号
                    </label>
                    <input
                        className="content-form-input"
                        type="text"
                        name="postal_code"
                        value={data.postal_code}
                        onChange={(e) => setData("postal_code", e.target.value)}
                    />
                    {errors.postal_code && (
                        <p className="form-error">{errors.postal_code}</p>
                    )}

                    <label className="content-form-label" htmlFor="address">
                        住所
                    </label>
                    <input
                        className="content-form-input"
                        type="text"
                        name="address"
                        value={data.address}
                        onChange={(e) => setData("address", e.target.value)}
                    />
                    {errors.address && (
                        <p className="form-error">{errors.address}</p>
                    )}

                    <label className="content-form-label" htmlFor="building">
                        建物名
                    </label>
                    <input
                        className="content-form-input"
                        type="text"
                        name="building"
                        value={data.building}
                        onChange={(e) => setData("building", e.target.value)}
                    />
                    {errors.building && (
                        <p className="form-error">{errors.building}</p>
                    )}

                    {/* hidden input for uploaded image path */}
                    <input
                        type="hidden"
                        name="profile_uploaded_image_path"
                        value={data.profile_uploaded_image_path}
                    />

                    <input
                        className="content-form-btn"
                        type="submit"
                        value="更新する"
                        disabled={processing}
                    />
                </form>
            </div>
        </AppLayout>
    );
}
