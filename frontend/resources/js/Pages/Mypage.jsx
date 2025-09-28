import React, { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import "../../css/users/show.css";
import AppLayout from "@/Layouts/AppLayout";
import { route } from "ziggy-js";
import { Ziggy } from "@/ziggy";

function Mypage() {
    useEffect(() => {
        if (import.meta.env.DEV) {
            const handleHMR = () => {
                console.log("HMR detected, reloading...");
                setTimeout(() => window.location.reload(), 100);
            };

            if (import.meta.hot) {
                import.meta.hot.accept(handleHMR);
            }
        }
    }, []);

    const { auth, page, sellItems, buyItems } = usePage().props;
    const itemsToShow = page === "sell" ? sellItems : buyItems;

    const tabs = [
        { key: "sell", label: "出品商品" },
        { key: "buy", label: "購入商品" },
    ];

    return (
        <div>
            <div className="profile-header">
                {auth.user.profile_image_url ? (
                    <img
                        className="image-circle"
                        src={auth.user.profile_image_url}
                        alt="プロフィール画像"
                    />
                ) : (
                    <div className="image-circle"></div>
                )}

                <h2 className="username">{auth.user.name}</h2>
                <a className="edit-profile" href="/mypage/profile">
                    プロフィールを編集
                </a>
            </div>

            <div className="page">
                {tabs.map(({ key, label }) => (
                    <Link
                        key={key}
                        href={route("mypage", { page: key }, Ziggy)}
                        preserveScroll
                        className={`page-${key} ${
                            page === key ? "page-active" : ""
                        }`}
                    >
                        {label}
                    </Link>
                ))}
            </div>

            <div className="profile-wrapper">
                {itemsToShow.map((item) => (
                    <Link
                        key={item.id}
                        href={route("item.show", { id: item.id }, Ziggy)}
                        className="item-container-link"
                    >
                        <div className="item-container">
                            <img
                                className="item-image"
                                src={`/storage/items/${item.image_filename}`}
                                alt={item.name}
                            />
                            {item.purchase?.completed_at && (
                                <div className="sold-label">Sold</div>
                            )}
                            <div className="item-name">{item.name}</div>
                        </div>
                    </Link>
                ))}
                {/* ダミー要素 */}
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="item-container-empty"></div>
                ))}
            </div>
        </div>
    );
}

Mypage.layout = (page) => <AppLayout title="マイページ">{page}</AppLayout>;
export default Mypage;
