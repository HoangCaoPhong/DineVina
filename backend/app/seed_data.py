from typing import List, Dict, Any

SEED_VENUES: List[Dict[str, Any]] = [
    {
        "id": "v1",
        "name": "Nhà Hàng Lẩu Hoàng Gia - Chi Nhánh Mẫu 01",
        "slug": "lau-hoang-gia-demo",
        "address": "417 Đường Số 1, Phường 3, Quận 5",
        "district": "Quận 5",
        "city": "Hồ Chí Minh",
        "cuisine": "Lẩu Thảo Mộc",
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
        "description": "Lẩu thảo mộc gia truyền với nước dùng hầm xương thảo quả thượng hạng và quầy tráng miệng kem cao cấp không giới hạn.",
        "full_description": "Nhà hàng mang đến hành trình khám phá phong vị lẩu thanh ngọt tự nhiên cùng các loại thịt bò nhập khẩu hảo hạng: Bò hoa tuyết, gầu bò mềm ngậy, hải sản tươi giòn sần sật.",
        "contact_phone": "028 7300 1111",
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
        "name": "Nướng Than Hoa Sakura - Chi Nhánh Mẫu 02",
        "slug": "nuong-sakura-demo",
        "address": "Tầng B3, Trung Tâm Thương Mại Mẫu, Quận 1",
        "district": "Quận 1",
        "city": "Hồ Chí Minh",
        "cuisine": "Nướng Yakiniku",
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
        "description": "Nhà hàng nướng than hoa phong cách Nhật Bản với bò nướng sốt ướp Tare trứ danh.",
        "full_description": "Không gian nướng ấm cúng, sang trọng. Bò ướp sốt Tare đậm đà, sườn rút xương và lẩu thơm lừng mang lại bữa tiệc ẩm thực trọn vẹn cho gia đình.",
        "contact_phone": "028 3939 2222",
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
        "name": "Cung Đình Dimsum - Mỹ Vị Phương Đông",
        "slug": "cung-dinh-dimsum-demo",
        "address": "55 Đường Hoa Sen, Bến Nghé, Quận 1",
        "district": "Quận 1",
        "city": "Hồ Chí Minh",
        "cuisine": "Dimsum & Á Đông",
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
        "deal_label": "Tặng món Vịt quay giòn bì cho bàn từ 6 người",
        "opening_hours": "08:00 - 22:00",
        "description": "Thế giới Dimsum thủ công tươi nóng mỗi ngày và các món xào thố, Vịt quay da giòn rụm.",
        "full_description": "Không gian ẩm thực Á Đông sang trọng với các xửng dimsum tươi nóng hổi, xíu mại tôm thịt, há cảo ngọc bích cùng phòng VIP trang trọng cho tiếp khách hoặc họp mặt gia đình.",
        "contact_phone": "028 3826 3333",
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
        "name": "Nhà Vườn Hương Quê - Ẩm Thực Ba Miền",
        "slug": "nha-vuon-huong-que-demo",
        "address": "55A Đường Cây Xanh, Thảo Điền, Quận 2 (TP. Thủ Đức)",
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
        "description": "Không gian sân vườn xanh mát lãng mạn, phục vụ ẩm thực Việt 3 miền dân dã và tinh tế.",
        "full_description": "Không gian rợp bóng cây xanh tại Thảo Điền, giữ trọn vị ngọt tự nhiên của nguyên liệu đồng quê. Mâm cơm sum họp với cá kho tộ, canh rau thanh mát, chả giòn tan đậm đà bản sắc.",
        "contact_phone": "028 3899 4444",
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
        "name": "Đại Dương Xanh - Buffet Hải Sản Quốc Tế",
        "slug": "dai-duong-xanh-buffet-demo",
        "address": "Tầng 5 Trung Tâm Thương Mại Nam Sài Gòn, Quận 7",
        "district": "Quận 7",
        "city": "Hồ Chí Minh",
        "cuisine": "Buffet Hải Sản",
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
        "description": "Đại tiệc buffet hơn 200 món hải sản tươi sống, tôm càng, ghẹ biển, sashimi và tráng miệng phong phú.",
        "full_description": "Không gian rộng rãi sức chứa lớn thích hợp cho tiệc liên hoan công ty, sinh nhật, hội nghị. Thực đơn hải sản tươi sống chế biến nóng tại quầy cùng hàng trăm món ngon ẩm thực.",
        "contact_phone": "1900 8888",
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
        "name": "Bếp Nướng Củi Lò Ý - Artisan Pizza & Phô Mai",
        "slug": "bep-nuong-cui-artisan-demo",
        "address": "151 Đường Ánh Dương, Phường 6, Quận 3",
        "district": "Quận 3",
        "city": "Hồ Chí Minh",
        "cuisine": "Pizza & Món Âu",
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
        "deal_label": "Tặng món bánh phô mai nướng khi đặt bàn trước qua DineVina",
        "opening_hours": "10:00 - 23:00",
        "description": "Pizza lò củi thơm nồng kết hợp phô mai tươi thủ công và sốt cà chua thảo mộc tự nhiên.",
        "full_description": "Không gian ấm cúng, sang trọng với các món Pizza nướng củi giòn vỏ mềm ruột, mỳ Ý kem hải sản và đồ uống giải khát mát lạnh.",
        "contact_phone": "028 3622 5555",
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
        "body": "Đặt bàn qua DineVina được giảm 30% vào khung giờ 11:00. Nhân viên giữ bàn chu đáo, đồ ăn ngon và kem tráng miệng thỏa thích!",
        "created_at": "2026-10-14 13:40",
        "partner_reply": "Cảm ơn bạn Quân đã tin chọn Nhà hàng Lẩu Hoàng Gia! Hẹn gặp lại bạn lần tới nhé ạ.",
        "is_hidden": False
    },
    {
        "id": "rev_2",
        "reservation_id": "res_demo_2",
        "venue_id": "v2",
        "customer_name": "Lê Thu Hà",
        "rating": 5,
        "body": "Thịt bò nướng mềm thơm đậm đà, hệ thống hút khói rất tốt không hề bị ám mùi. Sẽ quay lại nhiều lần!",
        "created_at": "2026-10-12 20:15",
        "partner_reply": "Nhà hàng Sakura rất vui được phục vụ bạn và gia đình ạ!",
        "is_hidden": False
    }
]

SEED_RESERVATIONS: List[Dict[str, Any]] = [
    {
        "id": "res_1001",
        "confirmation_code": "DV-78921",
        "venue_id": "v1",
        "venue_name": "Nhà Hàng Lẩu Hoàng Gia - Chi Nhánh Mẫu 01",
        "venue_address": "417 Đường Số 1, Phường 3, Quận 5",
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
                "actor_name": "Quản lý Lẩu Hoàng Gia",
                "reason": "Đã sẵn sàng bàn 4 khách tầng 2",
                "changed_at": "2026-10-16 10:45"
            }
        ]
    },
    {
        "id": "res_1002",
        "confirmation_code": "DV-45120",
        "venue_id": "v2",
        "venue_name": "Nướng Than Hoa Sakura - Chi Nhánh Mẫu 02",
        "venue_address": "Tầng B3, Trung Tâm Thương Mại Mẫu, Quận 1",
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
        "message": "Nhà hàng Lẩu Hoàng Gia đã xác nhận yêu cầu đặt bàn #DV-78921 của bạn lúc 18:00 ngày 18/10.",
        "type": "reservation",
        "read": False,
        "created_at": "2026-10-16 10:45",
        "link": "/my-bookings"
    },
    {
        "id": "notif_2",
        "user_id": "cust_1",
        "title": "Ưu đãi khung giờ mới",
        "message": "Nhà hàng Sakura vừa mở thêm 5 suất giảm 50% khung giờ 14:00 hôm nay!",
        "type": "deal",
        "read": True,
        "created_at": "2026-10-15 09:00",
        "link": "/venues/v2"
    }
]
