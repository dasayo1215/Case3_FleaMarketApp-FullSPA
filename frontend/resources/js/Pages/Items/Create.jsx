import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import "../../../css/items/create.css";
import AppLayout from "@/Layouts/AppLayout";

export default function Create() {
    const { categories, conditions, errors } = usePage().props;

    const { data, setData, post, processing } = useForm({
        sell_uploaded_image_path: "",
        category_id: [],
        item_condition_id: "",
        name: "",
        brand: "",
        description: "",
        price: "",
    });

    const [preview, setPreview] = useState("");
    const [imageError, setImageError] = useState("");

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const token = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        const res = await fetch("/sell/image", {
            method: "POST",
            body: formData,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": token, // ← これが必須！
            },
        });

        const result = await res.json();

        if (result.success) {
            setPreview(result.image_url + "?v=" + Date.now());
            setData("sell_uploaded_image_path", result.path);
            setImageError(""); // 成功時は消す
        } else if (result.errors?.image) {
            // バリデーションエラー
            setImageError(result.errors.image);
        } else {
            setImageError("画像アップロードに失敗しました");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/sell");
    };

    return (
        <AppLayout title="商品の出品">
            <div className="content-wrapper">
                <h2 className="content-heading">商品の出品</h2>

                <label className="content-form-label" htmlFor="image">
                    商品画像
                </label>
                <div className="image-wrapper">
                    {preview && (
                        <img
                            className="uploaded-image"
                            src={preview}
                            alt="アップロード画像"
                        />
                    )}
                    <label className="image-label" htmlFor="imageInput">
                        画像を選択する
                    </label>
                    <input
                        type="file"
                        id="imageInput"
                        className="image-input-hidden"
                        onChange={handleImageChange}
                    />
                </div>
                {imageError && <p className="form-error">{imageError}</p>}

                <form className="content-form-wrapper" onSubmit={handleSubmit}>
                    <h3 className="item-title">商品の詳細</h3>
                    <label className="content-form-label">カテゴリー</label>
                    <div className="categories">
                        {categories.map((cat) => (
                            <label key={cat.id} className="category-button">
                                <input
                                    type="checkbox"
                                    className="category-input"
                                    value={cat.id}
                                    checked={data.category_id.includes(cat.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setData("category_id", [
                                                ...data.category_id,
                                                cat.id,
                                            ]);
                                        } else {
                                            setData(
                                                "category_id",
                                                data.category_id.filter(
                                                    (id) => id !== cat.id
                                                )
                                            );
                                        }
                                    }}
                                />
                                <span className="category-text">
                                    {cat.name}
                                </span>
                            </label>
                        ))}
                    </div>
                    {errors.category_id && (
                        <p className="form-error">{errors.category_id}</p>
                    )}

                    <label
                        className="content-form-label"
                        htmlFor="item_condition_id"
                    >
                        商品の状態
                    </label>
                    <select
                        className="content-form-input content-form-select"
                        id="item_condition_id"
                        value={data.item_condition_id}
                        onChange={(e) =>
                            setData("item_condition_id", e.target.value)
                        }
                    >
                        <option value="">選択してください</option>
                        {conditions.map((cond) => (
                            <option key={cond.id} value={cond.id}>
                                {cond.name}
                            </option>
                        ))}
                    </select>
                    {errors.item_condition_id && (
                        <p className="form-error">{errors.item_condition_id}</p>
                    )}

                    <h3 className="item-title">商品名と説明</h3>
                    <label className="content-form-label" htmlFor="name">
                        商品名
                    </label>
                    <input
                        className="content-form-input"
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                    />
                    {errors.name && <p className="form-error">{errors.name}</p>}

                    <label className="content-form-label" htmlFor="brand">
                        ブランド名
                    </label>
                    <input
                        className="content-form-input"
                        type="text"
                        id="brand"
                        value={data.brand}
                        onChange={(e) => setData("brand", e.target.value)}
                    />
                    {errors.brand && (
                        <p className="form-error">{errors.brand}</p>
                    )}

                    <label className="content-form-label" htmlFor="description">
                        商品の説明
                    </label>
                    <textarea
                        className="content-form-textarea"
                        id="description"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                    {errors.description && (
                        <p className="form-error">{errors.description}</p>
                    )}

                    <label className="content-form-label" htmlFor="price">
                        販売価格
                    </label>
                    <div className="input-wrapper">
                        <span className="price-prefix">¥</span>
                        <input
                            className="price-input"
                            type="text"
                            id="price"
                            inputMode="numeric"
                            value={data.price}
                            onChange={(e) => {
                                const value = e.target.value.replace(/,/g, "");
                                if (!isNaN(value) && value !== "") {
                                    setData(
                                        "price",
                                        Number(value).toLocaleString()
                                    );
                                } else {
                                    setData("price", "");
                                }
                            }}
                        />
                    </div>
                    {errors.price && (
                        <p className="form-error">{errors.price}</p>
                    )}

                    <input
                        type="hidden"
                        name="sell_uploaded_image_path"
                        value={data.sell_uploaded_image_path}
                    />
                    <button
                        className="content-form-btn"
                        type="submit"
                        disabled={processing}
                    >
                        出品する
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
