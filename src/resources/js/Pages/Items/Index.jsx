import React from "react";
import { Link, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import "../../../css/items/index.css";

export default function Index() {
    const { items, page, keyword } = usePage().props;

    return (
        <AppLayout title="商品一覧">
            <div className="page">
                <Link
                    href={route("index", { page: null, keyword })}
                    className={`page-recommend ${
                        page !== "mylist" ? "page-active" : ""
                    }`}
                >
                    おすすめ
                </Link>
                <Link
                    href={route("index", { page: "mylist", keyword })}
                    className={`page-mylist ${
                        page === "mylist" ? "page-active" : ""
                    }`}
                >
                    マイリスト
                </Link>
            </div>

            <div className="content-wrapper-small">
                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={`/item/${item.id}`}
                        className="item-container-link"
                    >
                        <div className="item-container">
                            <img
                                className="item-image"
                                src={`/storage/items/${item.image_filename}`}
                                alt={item.name}
                            />
                            {item.purchase && item.purchase.completed_at && (
                                <div className="sold-label">Sold</div>
                            )}
                            <div className="item-name">{item.name}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </AppLayout>
    );
}
