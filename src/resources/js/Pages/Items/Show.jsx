import React, { useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import "../../../css/items/show.css";

export default function Show() {
    const {
        item,
        user,
        isLiked = false,
        likeCount = 0,
        commentCount = 0,
        comments: initialComments = [],
    } = usePage().props;

    const [liked, setLiked] = useState(isLiked);
    const [likes, setLikes] = useState(likeCount);
    const [comments, setComments] = useState(initialComments || []);
    const [commentText, setCommentText] = useState("");
    const [commentError, setCommentError] = useState("");

    const handleToggleLike = async (e) => {
        e.preventDefault();
        const res = await fetch(`/item/${item.id}/like`, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]'
                ).content,
                Accept: "application/json",
            },
        });
        const data = await res.json();
        setLiked(data.liked);
        setLikes(data.like_count);
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        setCommentError("");

        const formData = new FormData();
        formData.append("comment", commentText);

        const res = await fetch(`/item/${item.id}/comment`, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]'
                ).content,
                Accept: "application/json",
            },
            body: formData,
        });

        if (res.status === 422) {
            const data = await res.json();
            if (data.errors?.comment) {
                setCommentError(data.errors.comment[0]);
            }
            return;
        }

        const data = await res.json();
        if (data.success) {
            setComments([...comments, data.comment]);
            setCommentText("");
        } else {
            setCommentError("コメントの送信に失敗しました");
        }
    };

    return (
        <AppLayout title={item.name}>
            <div className="item-content-wrapper">
                <div className="image-container">
                    <img
                        className="image-square"
                        src={`/storage/items/${
                            item.image_filename
                        }?v=${Date.now()}`}
                        alt={item.name}
                    />
                    {item.purchase && item.purchase.completed_at && (
                        <div className="sold-label">Sold</div>
                    )}
                </div>

                <div className="content-detail">
                    <div className="content-heading">
                        <h2 className="item-name">{item.name}</h2>
                        <div className="content-brand">{item.brand}</div>
                        <div className="content-price">
                            ￥{" "}
                            <span className="content-price-num">
                                {Number(item.price).toLocaleString()}
                            </span>
                            （税込）
                        </div>

                        <div className="content-like-comment">
                            <div className="content-like">
                                {user ? (
                                    <button
                                        className="like-button"
                                        onClick={handleToggleLike}
                                    >
                                        <img
                                            className="content-like-img"
                                            src={
                                                liked
                                                    ? "/storage/assets/star-on.png"
                                                    : "/storage/assets/star-off.png"
                                            }
                                            alt="いいね"
                                        />
                                    </button>
                                ) : (
                                    <div className="like-button disabled">
                                        <img
                                            className="content-like-img-guest"
                                            src="/storage/assets/star-off.png"
                                            alt="いいね"
                                        />
                                    </div>
                                )}
                                <div className="content-like-num">{likes}</div>
                            </div>

                            <div className="content-comment">
                                <img
                                    className="content-comment-img"
                                    src="/storage/assets/bubble.png"
                                    alt="コメント"
                                />
                                <div className="content-comment-num">
                                    {comments.length}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 購入ボタンエリア */}
                    {user && item.seller_id === user.id ? (
                        <div className="purchase-unavailable">
                            自身の出品です
                        </div>
                    ) : item.purchase ? (
                        item.purchase.paid_at ? (
                            <div className="purchase-sold">Sold</div>
                        ) : !user || item.purchase.buyer_id !== user.id ? (
                            <div className="purchase-unavailable">
                                他ユーザーが購入手続き中です
                            </div>
                        ) : item.purchase.completed_at &&
                          item.purchase.buyer_id === user.id ? (
                            <div className="purchase-unavailable">
                                お支払いを完了してください
                            </div>
                        ) : (
                            <a
                                className="content-purchase-btn"
                                href={`/purchase/${item.id}`}
                            >
                                購入手続きを再開
                            </a>
                        )
                    ) : (
                        <a
                            className="content-purchase-btn"
                            href={`/purchase/${item.id}`}
                        >
                            購入手続きへ
                        </a>
                    )}

                    {/* 商品説明 */}
                    <h3 className="item-description">商品説明</h3>
                    <div>{item.description}</div>

                    {/* 商品情報 */}
                    <h3 className="item-info">商品の情報</h3>
                    <table className="info-table">
                        <tbody>
                            <tr className="info-table-tr table-row1">
                                <th className="info-table-th th-category">
                                    カテゴリー
                                </th>
                                <td className="td-category">
                                    {item.categories.map((c) => (
                                        <span
                                            key={c.id}
                                            className="td-category-span"
                                        >
                                            {c.name}
                                        </span>
                                    ))}
                                </td>
                            </tr>
                            <tr className="info-table-tr">
                                <th className="info-table-th">商品の状態</th>
                                <td className="td-state">
                                    {item.item_condition?.name}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* コメント */}
                    <h3 className="comment-title">
                        コメント({comments.length})
                    </h3>
                    {comments.map((c, i) => (
                        <div key={i}>
                            <div className="comment-user">
                                <div className="user-image-container">
                                    {c.user_image ? (
                                        <img
                                            className="comment-user-image"
                                            src={`/storage/users/${c.user_image}`}
                                            alt={c.user_name}
                                        />
                                    ) : (
                                        <div className="comment-user-image"></div>
                                    )}
                                </div>
                                <div className="comment-user-name">
                                    {c.user_name}
                                </div>
                            </div>
                            <div className="comment-content">{c.text}</div>
                        </div>
                    ))}

                    {user ? (
                        <form
                            className="comment-form"
                            onSubmit={handleSubmitComment}
                        >
                            <label
                                className="content-form-label"
                                htmlFor="comment"
                            >
                                商品へのコメント
                            </label>
                            <textarea
                                className="content-form-textarea form-control"
                                id="comment"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            {commentError && (
                                <p className="form-error">{commentError}</p>
                            )}
                            <button className="content-form-btn" type="submit">
                                コメントを送信する
                            </button>
                        </form>
                    ) : (
                        <Link
                            href="/login"
                            as="button"
                            className="content-form-btn"
                        >
                            ログインしてコメントする
                        </Link>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
