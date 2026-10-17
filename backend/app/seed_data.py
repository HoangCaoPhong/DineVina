from typing import List, Dict, Any

SEED_VENUES: List[Dict[str, Any]] = [
    {
        "id": "v1",
        "name": "Manwah Taiwanese Hotpot - An Dương Vương",
        "slug": "manwah-taiwanese-hotpot",
        "address": "417 An Dương Vương, Phường 3, Quận 5",
        "district": "Quận 5",
        "city": "Hồ Chí Minh",
        "cuisine": "Lẩu Đài Loan",
        "price_range": "350.000đ - 480.000đ",
        "rating": 4.8,
        "review_count": 342,
        "cover_image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
        "images": [
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
        ],
        "amenities": ["Phòng riêng", "Chỗ đỗ ô tô", "Ghế trẻ em", "Điều hòa", "Thanh toán thẻ"],
        "status": "approved",
        "max_discount": 30,
        "deal_label": "Ưu đãi giảm tới 30% buffet",
        "opening_hours": "10:30 - 22:00",
        "description": "Lẩu Đài Loan truyền thống với nước dùng hầm xương thảo mộc thượng hạng và quầy tráng miệng kem Haagen-Dazs không giới hạn.",
        "full_description": "Manwah đưa thực khách vào hành trình khám phá phong vị ẩm thực xứ Đài với hương vị lẩu ngọt thanh từ thảo mộc quý cùng các loại thịt bò nhập khẩu hảo hạng: Bò Mỹ Iberico, gầu bò Úc, mực nút giòn sần sật.",
        "contact_phone": "028 7300 7981",
        "cancellation_cutoff_hours": 2,
        "available_seats": 80,
        "owner_id": "partner_1",
        "time_slots": [
            {"time": "11:00", "discount_percent": 30, "remaining_tables": 4},
            {"time": "11:30", "discount_percent": 20, "remaining_tables": 6},
            {"time": "12:00", "discount_percent": 10, "remaining_tables": 2},
            {"time": "13:30", "discount_percent": 30, "remaining_tables": 5},
            {"time": "17:30", "discount_percent": 20, "remaining_tables": 3},
            {"time": "18:00", "discount_percent": 10, "remaining_tables": 1},
            {"time": "19:00", "discount_percent": 0, "remaining_tables": 2},
            {"time": "20:30", "discount_percent": 30, "remaining_tables": 6}
        ]
    },
    {
        "id": "v2",
        "name": "Gyu-Kaku Japanese BBQ - Vincom Đồng Khởi",
        "slug": "gyu-kaku-japanese-bbq",
        "address": "Tầng B3-17, 72 Lê Thánh Tôn, Bến Nghé, Quận 1",
        "district": "Quận 1",
        "city": "Hồ Chí Minh",
        "cuisine": "Nướng Nhật Bản",
        "price_range": "299.000đ - 520.000đ",
        "rating": 4.9,
        "review_count": 489,
        "cover_image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
        "images": [
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
        ],
        "amenities": ["Phòng riêng", "Bàn VIP", "Hút khói tại bàn", "Chỗ đỗ ô tô"],
        "status": "approved",
        "max_discount": 50,
        "deal_label": "Giảm 50% suất Buffet cho khung giờ vàng",
        "opening_hours": "10:00 - 22:30",
        "description": "Chuỗi nhà hàng nướng BBQ than hoa số 1 Nhật Bản với bò Wagyu và sốt ướp Tare trứ danh.",
        "full_description": "Gyu-Kaku là hệ thống nướng Yakiniku chuẩn Nhật với hơn 700 chi nhánh toàn cầu. Bò Wagyu ướp sốt Tare, sườn bò không xương và lẩu Miso hấp dẫn cùng không gian ấm cúng sang trọng.",
        "contact_phone": "028 3939 7788",
        "cancellation_cutoff_hours": 2,
        "available_seats": 65,
        "owner_id": "partner_2",
        "time_slots": [
            {"time": "11:00", "discount_percent": 50, "remaining_tables": 3},
            {"time": "11:30", "discount_percent": 30, "remaining_tables": 4},
            {"time": "12:00", "discount_percent": 15, "remaining_tables": 3},
            {"time": "14:00", "discount_percent": 50, "remaining_tables": 7},
            {"time": "17:00", "discount_percent": 30, "remaining_tables": 5},
            {"time": "18:30", "discount_percent": 10, "remaining_tables": 2},
            {"time": "20:30", "discount_percent": 50, "remaining_tables": 5}
        ]
    },
    {
        "id": "v3",
        "name": "Dim Tu Tac - Ẩm Thực Quảng Đông",
        "slug": "dim-tu-tac-cantonese",
        "address": "55 Đông Du, Bến Nghé, Quận 1",
        "district": "Quận 1",
        "city": "Hồ Chí Minh",
        "cuisine": "Dimsum & Hoa",
        "price_range": "300.000đ - 650.000đ",
        "rating": 4.7,
        "review_count": 275,
        "cover_image": "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=1000&q=80",
        "images": [
            "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80"
        ],
        "amenities": ["Phòng tiệc lớn", "Phòng VIP riêng tư", "Tiệc sinh nhật", "Rượu vang"],
        "status": "approved",
        "max_discount": 20,
        "deal_label": "Tặng Vịt quay Bắc Kinh nửa con cho bàn từ 6 người",
        "opening_hours": "08:00 - 22:00",
        "description": "Thế giới Dimsum thủ công chuẩn phong vị Hồng Kông và các món xào thố, Vịt quay Bắc Kinh giòn rụm.",
        "full_description": "Dim Tu Tac với đội ngũ đầu bếp 5 sao đến từ Hồng Kông mang lại các xửng dimsum tươi nóng hổi, xíu mại tôm cua, há cảo tôm ngọc bích cùng không gian hiện đại và phòng VIP trang trọng cho tiếp khách hoặc họp mặt gia đình.",
        "contact_phone": "028 3826 6668",
        "cancellation_cutoff_hours": 3,
        "available_seats": 120,
        "owner_id": "partner_1",
        "time_slots": [
            {"time": "08:30", "discount_percent": 20, "remaining_tables": 8},
            {"time": "09:30", "discount_percent": 15, "remaining_tables": 6},
            {"time": "11:30", "discount_percent": 10, "remaining_tables": 3},
            {"time": "12:00", "discount_percent": 0, "remaining_tables": 2},
            {"time": "18:00", "discount_percent": 10, "remaining_tables": 4},
            {"time": "19:00", "discount_percent": 0, "remaining_tables": 1}
        ]
    },
    {
        "id": "v4",
        "name": "Quán Bụi Garden - Món Việt Thuần Túy",
        "slug": "quan-bui-garden",
        "address": "55A Ngô Quang Huy, Thảo Điền, Quận 2 (TP. Thủ Đức)",
        "district": "Quận 2",
        "city": "Hồ Chí Minh",
        "cuisine": "Món Việt",
        "price_range": "180.000đ - 350.000đ",
        "rating": 4.8,
        "review_count": 210,
        "cover_image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
        "images": [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=80"
        ],
        "amenities": ["Sân vườn thoáng mát", "Phòng máy lạnh", "Tổ chức tiệc ngoài trời", "Chỗ đỗ xe"],
        "status": "approved",
        "max_discount": 25,
        "deal_label": "Giảm 25% tổng bill đặt bàn trước 17:00",
        "opening_hours": "07:30 - 23:00",
        "description": "Không gian sân vườn xanh mát lãng mạn tại Thảo Điền, phục vụ ẩm thực Việt 3 miền dân dã và tinh tế.",
        "full_description": "Quán Bụi Garden không dùng bột ngọt, giữ trọn vị ngọt tự nhiên của thịt cá tươi. Mâm cơm gia đình với cá kho tộ, canh cua rau đay, nem cua bể giòn tan trong khuôn viên rợp bóng cây xanh tại Thảo Điền.",
        "contact_phone": "028 3899 9099",
        "cancellation_cutoff_hours": 1,
        "available_seats": 90,
        "owner_id": "partner_3",
        "time_slots": [
            {"time": "11:00", "discount_percent": 25, "remaining_tables": 6},
            {"time": "12:00", "discount_percent": 10, "remaining_tables": 4},
            {"time": "16:30", "discount_percent": 25, "remaining_tables": 5},
            {"time": "18:30", "discount_percent": 10, "remaining_tables": 2},
            {"time": "19:30", "discount_percent": 0, "remaining_tables": 3}
        ]
    },
    {
        "id": "v5",
        "name": "D'Maris Seafood & International Buffet",
        "slug": "dmaris-international-buffet",
        "address": "Tầng 5 Lotte Mart, 469 Nguyễn Hữu Thọ, Tân Hưng, Quận 7",
        "district": "Quận 7",
        "city": "Hồ Chí Minh",
        "cuisine": "Buffet Hải Sản & Quốc Tế",
        "price_range": "420.000đ - 680.000đ",
        "rating": 4.6,
        "review_count": 520,
        "cover_image": "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=1000&q=80",
        "images": [
            "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=1000&q=80"
        ],
        "amenities": ["Sức chứa 500 khách", "Sân khấu tổ chức sự kiện", "Khu vui chơi trẻ em", "Bãi xe ô tô lớn"],
        "status": "approved",
        "max_discount": 35,
        "deal_label": "Giảm 35% buffet trưa các ngày thứ 2 - thứ 6",
        "opening_hours": "11:30 - 22:00",
        "description": "Đại tiệc buffet hơn 250 món Á - Âu, tôm hùm, cua tuyết, cá hồi Na Uy và tráng miệng Pháp không giới hạn.",
        "full_description": "D'Maris sở hữu không gian rộng rãi hơn 3.000m² thích hợp cho tiệc công ty, sinh nhật, hội nghị. Thực đơn hải sản tươi sống chế biến nóng tại quầy cùng hàng trăm món ngon thế giới.",
        "contact_phone": "1900 0010",
        "cancellation_cutoff_hours": 4,
        "available_seats": 250,
        "owner_id": "partner_2",
        "time_slots": [
            {"time": "11:30", "discount_percent": 35, "remaining_tables": 10},
            {"time": "12:30", "discount_percent": 20, "remaining_tables": 8},
            {"time": "17:30", "discount_percent": 25, "remaining_tables": 6},
            {"time": "19:00", "discount_percent": 10, "remaining_tables": 4}
        ]
    },
    {
        "id": "v6",
        "name": "Pizza 4P's - Craft Beer & Homemade Cheese",
        "slug": "pizza-4ps-hai-ba-trung",
        "address": "151 Hai Bà Trưng, Phường 6, Quận 3",
        "district": "Quận 3",
        "city": "Hồ Chí Minh",
        "cuisine": "Pizza & Âu Nhật",
        "price_range": "250.000đ - 450.000đ",
        "rating": 4.9,
        "review_count": 630,
        "cover_image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80",
        "images": [
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80"
        ],
        "amenities": ["Lò nướng củi trực tiếp", "Bia thủ công", "Không gian lãng mạn"],
        "status": "approved",
        "max_discount": 15,
        "deal_label": "Tặng món Phô mai Burrata trứ danh khi đặt trước qua DineVina",
        "opening_hours": "10:00 - 23:00",
        "description": "Pizza lò củi thơm lừng kết hợp phô mai tươi tự làm tại trang trại Đơn Dương.",
        "full_description": "Pizza 4P's theo đuổi triết lý 'Make the World Smile for Peace'. Nổi tiếng với Pizza 4 loại phô mai mật ong, Mỳ cua sốt kem cà chua và bia thủ công mát lạnh.",
        "contact_phone": "028 3622 0500",
        "cancellation_cutoff_hours": 2,
        "available_seats": 70,
        "owner_id": "partner_3",
        "time_slots": [
            {"time": "11:00", "discount_percent": 15, "remaining_tables": 3},
            {"time": "14:00", "discount_percent": 15, "remaining_tables": 5},
            {"time": "17:30", "discount_percent": 10, "remaining_tables": 2},
            {"time": "20:30", "discount_percent": 15, "remaining_tables": 4}
        ]
    }
]

SEED_MENUS: Dict[str, List[Dict[str, Any]]] = {
    "v1": [
        {
            "id": "c1",
            "venue_id": "v1",
            "name": "Nước Lẩu Đặc Biệt",
            "position": 1,
            "dishes": [
                {
                    "id": "d1",
                    "category_id": "c1",
                    "name": "Lẩu Mala Đài Loan Cay Nồng",
                    "description": "Nước lẩu cay đặc trưng hoa tiêu Tứ Xuyên và hồi quế",
                    "price_vnd": 69000,
                    "image_url": "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&w=400&q=80",
                    "dietary_tags": ["Cay nồng", "Best seller"],
                    "available": True,
                    "is_special": True
                },
                {
                    "id": "d2",
                    "category_id": "c1",
                    "name": "Lẩu Nấm Thảo Mộc Dưỡng Nhan",
                    "description": "Nước dùng nấm đông cô, táo đỏ, kỷ tử ngọt thanh",
                    "price_vnd": 59000,
                    "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
                    "dietary_tags": ["Thanh đạm", "Tốt cho sức khỏe"],
                    "available": True,
                    "is_special": False
                }
            ]
        },
        {
            "id": "c2",
            "venue_id": "v1",
            "name": "Thịt Bò & Nhúng Thượng Hạng",
            "position": 2,
            "dishes": [
                {
                    "id": "d3",
                    "category_id": "c2",
                    "name": "Gầu Bò Úc Hoa Tuyết",
                    "description": "Từng lát gầu bò mỏng mềm, mỡ hoa đan xen ngậy béo",
                    "price_vnd": 129000,
                    "image_url": "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=400&q=80",
                    "dietary_tags": ["Bò thượng hạng"],
                    "available": True,
                    "is_special": True
                },
                {
                    "id": "d4",
                    "category_id": "c2",
                    "name": "Heo Iberico Tây Ban Nha",
                    "description": "Thịt heo đen ăn quả sồi thơm ngon trứ danh",
                    "price_vnd": 149000,
                    "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
                    "dietary_tags": ["Nhập khẩu"],
                    "available": True,
                    "is_special": False
                }
            ]
        }
    ],
    "v2": [
        {
            "id": "c3",
            "venue_id": "v2",
            "name": "Thịt Nướng Yakiniku",
            "position": 1,
            "dishes": [
                {
                    "id": "d5",
                    "category_id": "c3",
                    "name": "Sườn Bò Rút Xương Sốt Tare",
                    "description": "Bò nhập khẩu tẩm sốt ngọt Nhật Bản đậm đà",
                    "price_vnd": 189000,
                    "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
                    "dietary_tags": ["Món ký danh", "Best seller"],
                    "available": True,
                    "is_special": True
                },
                {
                    "id": "d6",
                    "category_id": "c3",
                    "name": "Ba Chỉ Bò Mỹ Nướng Muối Hành",
                    "description": "Nướng giòn thơm bùi hòa quyện cùng hành boa-rô",
                    "price_vnd": 119000,
                    "image_url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
                    "dietary_tags": [],
                    "available": True,
                    "is_special": False
                }
            ]
        }
    ]
}

SEED_REVIEWS: List[Dict[str, Any]] = [
    {
        "id": "rev_1",
        "reservation_id": "res_demo_1",
        "venue_id": "v1",
        "customer_name": "Trần Minh Quân",
        "rating": 5,
        "body": "Đặt bàn qua DineVina được giảm 30% vào khung giờ 11:00. Nhân viên giữ bàn chu đáo, đồ ăn ngon và kem Haagen-Dazs ăn thỏa thích!",
        "created_at": "2026-10-14 13:40",
        "partner_reply": "Cảm ơn bạn Quân đã tin chọn Manwah! Hẹn gặp lại bạn lần tới nhé ạ.",
        "is_hidden": False
    },
    {
        "id": "rev_2",
        "reservation_id": "res_demo_2",
        "venue_id": "v2",
        "customer_name": "Lê Thu Hà",
        "rating": 5,
        "body": "Thịt bò Wagyu mềm tan trong miệng, hệ thống hút khói rất tốt không hề bị ám mùi. Sẽ quay lại nhiều lần!",
        "created_at": "2026-10-12 20:15",
        "partner_reply": "Gyu-Kaku rất vui được phục vụ bạn và gia đình ạ!",
        "is_hidden": False
    }
]

SEED_RESERVATIONS: List[Dict[str, Any]] = [
    {
        "id": "res_1001",
        "confirmation_code": "DV-78921",
        "venue_id": "v1",
        "venue_name": "Manwah Taiwanese Hotpot - An Dương Vương",
        "venue_address": "417 An Dương Vương, Phường 3, Quận 5",
        "venue_image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
        "customer_id": "cust_1",
        "customer_name": "Nguyễn Văn A",
        "customer_phone": "0912 345 678",
        "reserved_date": "2026-10-18",
        "reserved_time": "18:00",
        "party_size": 4,
        "discount_percent": 10,
        "note": "Xếp bàn gần cửa sổ, tiệc họp mặt bạn bè",
        "status": "Confirmed",
        "created_at": "2026-10-16 10:30",
        "cancellation_cutoff_hours": 2,
        "can_cancel": True,
        "reject_reason": None,
        "status_history": [
            {
                "from_status": "Initial",
                "to_status": "Pending",
                "actor_id": "cust_1",
                "actor_name": "Nguyễn Văn A (Khách hàng)",
                "reason": "Yêu cầu đặt bàn mới",
                "changed_at": "2026-10-16 10:30"
            },
            {
                "from_status": "Pending",
                "to_status": "Confirmed",
                "actor_id": "partner_1",
                "actor_name": "Quản lý Manwah",
                "reason": "Đã sẵn sàng bàn 4 khách tầng 2",
                "changed_at": "2026-10-16 10:45"
            }
        ]
    },
    {
        "id": "res_1002",
        "confirmation_code": "DV-45120",
        "venue_id": "v2",
        "venue_name": "Gyu-Kaku Japanese BBQ - Vincom Đồng Khởi",
        "venue_address": "Tầng B3-17, 72 Lê Thánh Tôn, Bến Nghé, Quận 1",
        "venue_image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
        "customer_id": "cust_1",
        "customer_name": "Nguyễn Văn A",
        "customer_phone": "0912 345 678",
        "reserved_date": "2026-10-19",
        "reserved_time": "11:30",
        "party_size": 2,
        "discount_percent": 30,
        "note": "Ăn trưa nhanh",
        "status": "Pending",
        "created_at": "2026-10-16 14:10",
        "cancellation_cutoff_hours": 2,
        "can_cancel": True,
        "reject_reason": None,
        "status_history": [
            {
                "from_status": "Initial",
                "to_status": "Pending",
                "actor_id": "cust_1",
                "actor_name": "Nguyễn Văn A",
                "reason": "Yêu cầu đặt bàn kèm ưu đãi 30%",
                "changed_at": "2026-10-16 14:10"
            }
        ]
    }
]

SEED_NOTIFICATIONS: List[Dict[str, Any]] = [
    {
        "id": "notif_1",
        "user_id": "cust_1",
        "title": "Đặt bàn thành công!",
        "message": "Nhà hàng Manwah đã xác nhận yêu cầu đặt bàn #DV-78921 của bạn lúc 18:00 ngày 18/10.",
        "type": "reservation",
        "read": False,
        "created_at": "2026-10-16 10:45",
        "link": "/my-bookings"
    },
    {
        "id": "notif_2",
        "user_id": "cust_1",
        "title": "Ưu đãi khung giờ mới",
        "message": "Gyu-Kaku vừa mở thêm 5 suất giảm 50% khung giờ 14:00 hôm nay!",
        "type": "deal",
        "read": True,
        "created_at": "2026-10-15 09:00",
        "link": "/venues/v2"
    }
]
