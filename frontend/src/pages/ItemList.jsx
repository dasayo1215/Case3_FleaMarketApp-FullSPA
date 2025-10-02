import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ItemList() {
	const [items, setItems] = useState([]);

	useEffect(() => {
		axios.get('http://localhost/api/items').then((res) => {
			setItems(res.data);
		});
	}, []);

	return (
		<div>
			<h1>商品一覧</h1>
			<ul>
				{items.map((item) => (
					<li key={item.id}>
						{item.name} - ￥{item.price}
					</li>
				))}
			</ul>
		</div>
	);
}
