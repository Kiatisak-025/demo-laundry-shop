
import React, { useMemo, useState } from "react";
import {
  Home, Store, Shirt, CalendarDays, Settings, BookOpen,
  WashingMachine, Wind, Sparkles, Truck, User, Users,
  Phone, MapPin, Clock, Plus, Minus, Trash2, Edit,
  Search, Check, X, Camera, Package, ClipboardList,
  CreditCard, Banknote, ChevronRight, ArrowLeft, Save,
  Eye, Menu, Info, History, Image, ShoppingBag
} from "lucide-react";

const initialClothing = [
  { id: 1, name: "เสื้อยืด", price: 8, category: "เสื้อผ้า", image: "" },
  { id: 2, name: "กางเกงขาสั้น", price: 5, category: "เสื้อผ้า", image: "" },
  { id: 3, name: "กางเกงขายาว", price: 10, category: "เสื้อผ้า", image: "" },
  { id: 4, name: "เสื้อเชิ้ต", price: 12, category: "เสื้อผ้า", image: "" },
  { id: 5, name: "ผ้าห่ม", price: 20, category: "เครื่องนอน", image: "" },
  { id: 6, name: "ผ้าปูที่นอน", price: 15, category: "เครื่องนอน", image: "" },
  { id: 7, name: "ผ้าขนหนู", price: 8, category: "เครื่องนอน", image: "" },
  { id: 8, name: "ชุดเดรส", price: 20, category: "เสื้อผ้า", image: "" },
];

const initialProducts = [
  { id: 1, name: "น้ำยาซักผ้า", brand: "DEMO", type: "น้ำยาซักผ้า", scent: "กลิ่นหอมสดชื่น", price: 120 },
  { id: 2, name: "น้ำยาปรับผ้านุ่ม", brand: "DEMO", type: "น้ำยาปรับผ้านุ่ม", scent: "กลิ่นดอกไม้", price: 95 },
  { id: 3, name: "ผลิตภัณฑ์ขจัดคราบ", brand: "DEMO", type: "ขจัดคราบ", scent: "ไม่ระบุ", price: 150 },
];

const initialBookings = [
  {
    id: "DEMO-001",
    name: "คุณสมชาย",
    phone: "0812345678",
    method: "dropoff",
    address: "",
    pickupDate: "",
    pickupTime: "",
    items: [
      { clothingId: 1, name: "เสื้อยืด", quantity: 5, price: 8 },
      { clothingId: 2, name: "กางเกงขาสั้น", quantity: 2, price: 5 },
    ],
    services: ["ซัก", "อบ"],
    total: 50,
    status: "รอตรวจรับผ้า",
    paymentMethod: "ชำระตอนรับผ้าคืน",
    paymentStatus: "รอชำระเงิน",
    note: "แยกผ้าสีและผ้าขาว",
    detergents: [],
    defectImage: "",
    returnImage: "",
    returnDate: "",
    createdAt: "2026-11-10T10:00:00",
  },
  {
    id: "DEMO-002",
    name: "คุณสมหญิง",
    phone: "0898765432",
    method: "pickup",
    address: "บ้านเลขที่ 99 ตำบลในเมือง",
    pickupDate: "2026-11-14",
    pickupTime: "10:00",
    items: [
      { clothingId: 5, name: "ผ้าห่ม", quantity: 1, price: 20 },
    ],
    services: ["ซัก", "อบ"],
    total: 25,
    status: "รอเข้ารับผ้า",
    paymentMethod: "โอนเงินก่อนส่งคืน",
    paymentStatus: "รอตรวจสอบสลิป",
    note: "โทรแจ้งก่อนเข้ารับผ้า",
    detergents: ["น้ำยาซักผ้า"],
    defectImage: "",
    returnImage: "",
    returnDate: "",
    createdAt: "2026-11-11T09:30:00",
  },
];

const services = [
  { id: "ซัก", name: "ซักผ้า", price: 0, icon: WashingMachine, description: "ทำความสะอาดเสื้อผ้าและเครื่องนอน" },
  { id: "อบ", name: "อบผ้า", price: 5, icon: Wind, description: "ช่วยให้ผ้าแห้งพร้อมใช้งาน" },
  { id: "รีด", name: "รีดผ้า", price: 5, icon: Sparkles, description: "ดูแลเสื้อผ้าให้เรียบเรียบร้อย" },
];

const money = (value) => Number(value || 0).toLocaleString("th-TH");

const dateText = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
};

function readImage(file, callback) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("กรุณาเลือกไฟล์รูปภาพ");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function App() {
  const [page, setPage] = useState("home");
  const [adminTab, setAdminTab] = useState("bookings");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [clothing, setClothing] = useState(initialClothing);
  const [products, setProducts] = useState(initialProducts);
  const [bookings, setBookings] = useState(initialBookings);

  const [shopOpen, setShopOpen] = useState(true);
  const [shopReason, setShopReason] = useState("เจ้าของร้านมีธุระส่วนตัว");
  const [shopMessage, setShopMessage] = useState(
    "ร้านเปิดให้บริการตามปกติ สามารถนำผ้ามาส่งและจองคิวได้"
  );

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [guideTab, setGuideTab] = useState("customer");
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    method: "dropoff",
    address: "",
    pickupDate: "",
    pickupTime: "",
    items: [],
    services: ["ซัก"],
    note: "",
    paymentMethod: "ชำระตอนรับผ้าคืน",
  });

  const [newClothing, setNewClothing] = useState({
    name: "", price: "", category: "เสื้อผ้า", image: "",
  });
  const [editingClothing, setEditingClothing] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "", brand: "", type: "น้ำยาซักผ้า", scent: "", price: "", description: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId);

  const customerRecords = useMemo(() => {
    const groups = new Map();

    bookings.forEach((booking) => {
      const phone = (booking.phone || "").replace(/\D/g, "");
      const key = phone || booking.name.trim().toLowerCase();

      if (!groups.has(key)) {
        groups.set(key, {
          key,
          name: booking.name,
          phone: booking.phone,
          bookings: [],
        });
      }
      groups.get(key).bookings.push(booking);
    });

    return [...groups.values()].map((customer) => {
      const sorted = [...customer.bookings].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return {
        ...customer,
        bookings: sorted,
        count: sorted.length,
        paid: sorted
          .filter((b) => b.paymentStatus === "ชำระเงินแล้ว")
          .reduce((sum, b) => sum + Number(b.total || 0), 0),
        total: sorted.reduce((sum, b) => sum + Number(b.total || 0), 0),
      };
    });
  }, [bookings]);

  const filteredCustomers = customerRecords.filter((customer) =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (customer.phone || "").includes(customerSearch)
  );

  const activeCustomer = customerRecords.find(
    (customer) => customer.key === selectedCustomer
  );

  const totalItems = form.items.reduce((sum, item) => sum + item.quantity, 0);

  const calculateTotal = (items, selectedServices) => {
    const clothesTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const extra = services
      .filter((s) => s.id !== "ซัก" && selectedServices.includes(s.id))
      .reduce((sum, s) => sum + s.price * count, 0);
    return clothesTotal + extra;
  };

  const bookingTotal = calculateTotal(form.items, form.services);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const goTo = (nextPage) => {
    setPage(nextPage);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateForm = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const changeQuantity = (product, amount) => {
    setForm((previous) => {
      const found = previous.items.find((item) => item.clothingId === product.id);
      let items;

      if (found) {
        items = previous.items
          .map((item) =>
            item.clothingId === product.id
              ? { ...item, quantity: item.quantity + amount }
              : item
          )
          .filter((item) => item.quantity > 0);
      } else {
        items = amount > 0
          ? [...previous.items, {
              clothingId: product.id,
              name: product.name,
              quantity: amount,
              price: Number(product.price),
            }]
          : previous.items;
      }

      return { ...previous, items };
    });
  };

  const toggleService = (serviceId) => {
    if (serviceId === "ซัก") return;
    setForm((previous) => ({
      ...previous,
      services: previous.services.includes(serviceId)
        ? previous.services.filter((s) => s !== serviceId)
        : [...previous.services, serviceId],
    }));
  };

  const submitBooking = (event) => {
    event.preventDefault();

    if (!shopOpen) {
      showNotice("ขณะนี้ร้านปิดให้บริการ ยังไม่สามารถจองคิวได้");
      return;
    }
    if (!form.name.trim() || !form.phone.trim()) {
      showNotice("กรุณากรอกชื่อและเบอร์โทรศัพท์");
      return;
    }
    if (form.items.length === 0) {
      showNotice("กรุณาเลือกประเภทผ้าอย่างน้อย 1 รายการ");
      return;
    }
    if (form.method === "pickup") {
      if (!form.address.trim() || !form.pickupDate || !form.pickupTime) {
        showNotice("กรุณากรอกที่อยู่ วันและเวลาสำหรับรับผ้า");
        return;
      }
    }

    const newBooking = {
      ...form,
      id: `DEMO-${String(Date.now()).slice(-6)}`,
      total: bookingTotal,
      status: form.method === "pickup" ? "รอเข้ารับผ้า" : "รอตรวจรับผ้า",
      paymentStatus: form.paymentMethod === "โอนเงินก่อนส่งคืน"
        ? "รอตรวจสอบสลิป" : "รอชำระเงิน",
      detergents: [],
      defectImage: "",
      returnImage: "",
      returnDate: "",
      createdAt: new Date().toISOString(),
    };

    setBookings((previous) => [newBooking, ...previous]);
    setForm({
      name: "", phone: "", method: "dropoff", address: "",
      pickupDate: "", pickupTime: "", items: [],
      services: ["ซัก"], note: "",
      paymentMethod: "ชำระตอนรับผ้าคืน",
    });
    showNotice("ส่งรายการจองคิว DEMO สำเร็จ");
    goTo("home");
  };

  const updateBooking = (id, changes) => {
    setBookings((previous) =>
      previous.map((b) => b.id === id ? { ...b, ...changes } : b)
    );
  };

  const addClothing = (event) => {
    event.preventDefault();
    if (!newClothing.name.trim() || newClothing.price === "") {
      showNotice("กรุณากรอกชื่อประเภทผ้าและราคา");
      return;
    }
    setClothing((previous) => [
      ...previous,
      { ...newClothing, id: Date.now(), price: Number(newClothing.price) },
    ]);
    setNewClothing({ name: "", price: "", category: "เสื้อผ้า", image: "" });
    showNotice("เพิ่มประเภทผ้าเรียบร้อย");
  };

  const saveClothing = () => {
    if (!editingClothing?.name.trim() || editingClothing.price === "") {
      showNotice("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    setClothing((previous) =>
      previous.map((item) => item.id === editingClothing.id
        ? { ...editingClothing, price: Number(editingClothing.price) }
        : item
      )
    );
    setEditingClothing(null);
    showNotice("บันทึกการแก้ไขประเภทผ้าแล้ว");
  };

  const deleteClothing = (id) => {
    if (!window.confirm("ต้องการลบประเภทผ้านี้หรือไม่?")) return;
    setClothing((previous) => previous.filter((item) => item.id !== id));
    showNotice("ลบประเภทผ้าแล้ว");
  };

  const addProduct = (event) => {
    event.preventDefault();
    if (!newProduct.name.trim()) {
      showNotice("กรุณากรอกชื่อผลิตภัณฑ์");
      return;
    }
    setProducts((previous) => [
      ...previous,
      { ...newProduct, id: Date.now(), price: Number(newProduct.price || 0) },
    ]);
    setNewProduct({
      name: "", brand: "", type: "น้ำยาซักผ้า",
      scent: "", price: "", description: "",
    });
    showNotice("เพิ่มผลิตภัณฑ์เรียบร้อย");
  };

  const saveProduct = () => {
    if (!editingProduct?.name.trim()) {
      showNotice("กรุณากรอกชื่อผลิตภัณฑ์");
      return;
    }
    setProducts((previous) =>
      previous.map((item) => item.id === editingProduct.id
        ? { ...editingProduct, price: Number(editingProduct.price || 0) }
        : item
      )
    );
    setEditingProduct(null);
    showNotice("บันทึกผลิตภัณฑ์แล้ว");
  };

  const deleteProduct = (id) => {
    if (!window.confirm("ต้องการลบผลิตภัณฑ์นี้หรือไม่?")) return;
    setProducts((previous) => previous.filter((item) => item.id !== id));
    showNotice("ลบผลิตภัณฑ์แล้ว");
  };

  const statusColor = (status) => {
    if (["เสร็จสิ้น", "ชำระเงินแล้ว", "ส่งคืนแล้ว"].includes(status)) return "green";
    if (["ยกเลิก"].includes(status)) return "red";
    if (["กำลังดำเนินการ", "กำลังซัก", "กำลังอบ", "กำลังรีด"].includes(status)) return "blue";
    return "orange";
  };

  const navItems = [
    ["home", "หน้าแรก", Home],
    ["services", "บริการ", WashingMachine],
    ["catalog", "รายการผ้า", Shirt],
    ["booking", "จองคิว", CalendarDays],
    ["guide", "คู่มือการใช้งาน", BookOpen],
    ["admin", "ผู้ดูแลระบบ", Settings],
  ];

  const guideCustomer = [
    {
      title: "ตรวจสอบสถานะร้าน",
      icon: Store,
      description: "ก่อนจองคิว ให้ตรวจสอบสถานะร้านที่หน้าแรก หากร้านปิดให้บริการ จะยังไม่สามารถส่งรายการจองใหม่ได้",
      steps: ["เข้าสู่หน้าแรกของเว็บไซต์", "ดูแถบสถานะร้าน", "หากร้านเปิดให้บริการ สามารถกดจองคิวได้"],
    },
    {
      title: "เลือกรูปแบบการใช้บริการ",
      icon: Truck,
      description: "ลูกค้าสามารถเลือกนำผ้ามาส่งเอง หรือเรียกให้ร้านไปรับผ้าและนำไปส่งคืน",
      steps: ["เลือกเมนูจองคิว", "เลือกนำผ้ามาส่งที่ร้าน หรือเรียกให้ร้านไปรับ", "กรณีเรียกรับผ้า ให้กรอกที่อยู่ วันและเวลาที่สะดวก"],
    },
    {
      title: "กรอกข้อมูลลูกค้า",
      icon: User,
      description: "กรอกชื่อและเบอร์โทรศัพท์เพื่อให้ร้านติดต่อกลับและใช้ค้นหาประวัติการใช้บริการ",
      steps: ["กรอกชื่อผู้ใช้บริการ", "กรอกเบอร์โทรศัพท์ที่ติดต่อได้", "ตรวจสอบความถูกต้องก่อนดำเนินการต่อ"],
    },
    {
      title: "เลือกประเภทผ้า",
      icon: Shirt,
      description: "เลือกชนิดผ้าที่ต้องการส่งซัก พร้อมระบุจำนวนของแต่ละประเภท",
      steps: ["ดูรายการประเภทผ้าที่ร้านรับบริการ", "กดปุ่มบวกเพื่อเพิ่มจำนวน", "กดปุ่มลบเพื่อลดจำนวน", "ตรวจสอบรายการและยอดรวม"],
    },
    {
      title: "เลือกบริการซัก อบ และรีด",
      icon: Sparkles,
      description: "ลูกค้าสามารถเลือกบริการเพิ่มเติมได้ตามต้องการ และเขียนคำแนะนำให้ร้านทราบ",
      steps: ["เลือกบริการซักเป็นบริการหลัก", "เลือกบริการอบหรือรีดเพิ่มเติมได้", "พิมพ์หมายเหตุ เช่น แยกผ้าสี หรือไม่ใช้น้ำยาปรับผ้านุ่ม"],
    },
    {
      title: "เลือกวิธีชำระเงินและยืนยัน",
      icon: CreditCard,
      description: "เลือกวิธีชำระเงินที่ต้องการ จากนั้นตรวจสอบข้อมูลและยืนยันการจอง",
      steps: ["เลือกโอนเงินก่อนส่งคืน หรือชำระตอนรับผ้าคืน", "ตรวจสอบรายการผ้าและยอดรวม", "กดยืนยันการจองคิว", "รอร้านดำเนินการตามรายการ"],
    },
  ];

  const guideAdmin = [
    {
      title: "จัดการสถานะเปิด–ปิดร้าน",
      icon: Store,
      description: "เจ้าของร้านสามารถประกาศเปิดหรือปิดร้านชั่วคราวได้ตามสถานการณ์",
      steps: ["เข้าเมนูผู้ดูแลระบบ", "เลือกสถานะร้าน", "เลือกเปิดให้บริการหรือปิดชั่วคราว", "ระบุเหตุผลและข้อความแจ้งลูกค้า", "บันทึกสถานะ"],
    },
    {
      title: "จัดการประเภทผ้าและรูปภาพ",
      icon: Shirt,
      description: "เพิ่มประเภทผ้า กำหนดราคา และอัปโหลดรูปภาพจริงเพื่อให้ลูกค้าเห็นในหน้าเว็บไซต์",
      steps: ["เลือกเมนูจัดการประเภทผ้า", "กรอกชื่อและราคา", "เลือกหมวดหมู่", "เลือกรูปภาพจากคอมพิวเตอร์", "กดเพิ่มประเภทผ้า", "หากต้องการแก้ไขให้กดปุ่มแก้ไข"],
    },
    {
      title: "จัดการรายการจอง",
      icon: ClipboardList,
      description: "ตรวจสอบข้อมูลลูกค้า รายการผ้า วิธีรับส่ง และรายละเอียดงานแต่ละรายการ",
      steps: ["เข้าเมนูจัดการรายการจอง", "เลือกรายการที่ต้องการตรวจสอบ", "ดูข้อมูลลูกค้าและรายการผ้า", "เปลี่ยนสถานะงานตามขั้นตอนจริง", "บันทึกข้อมูลที่เกี่ยวข้อง"],
    },
    {
      title: "บันทึกภาพตำหนิและภาพส่งคืน",
      icon: Camera,
      description: "บันทึกภาพเพื่อเป็นหลักฐานประกอบการรับและส่งคืนผ้า",
      steps: ["ตรวจดูผ้าตอนรับเข้าร้าน", "ถ่ายภาพเฉพาะชิ้นที่มีตำหนิอยู่ก่อนแล้ว เช่น รอยขาดหรือรอยเปื้อน", "ไม่จำเป็นต้องถ่ายภาพผ้าทุกชิ้น", "เมื่อส่งคืนให้ถ่ายภาพหลักฐานการส่งคืน", "บันทึกวันและเวลาส่งคืน"],
    },
    {
      title: "จัดการผลิตภัณฑ์ซักรีด",
      icon: Package,
      description: "บันทึกผลิตภัณฑ์ที่ร้านใช้ เช่น น้ำยาซักผ้า น้ำยาปรับผ้านุ่ม และผลิตภัณฑ์ขจัดคราบ",
      steps: ["เข้าเมนูผลิตภัณฑ์ซักรีด", "เพิ่มชื่อ ยี่ห้อ ประเภท กลิ่น และราคา", "แก้ไขหรือลบข้อมูลได้", "เลือกผลิตภัณฑ์ที่ใช้ในรายละเอียดงานแต่ละรายการ"],
    },
    {
      title: "ตรวจสอบประวัติลูกค้าและการชำระเงิน",
      icon: History,
      description: "ค้นหาลูกค้าและดูรายการใช้บริการย้อนหลังจากเบอร์โทรศัพท์",
      steps: ["เข้าเมนูประวัติลูกค้า", "ค้นหาด้วยชื่อหรือเบอร์โทรศัพท์", "เลือกชื่อลูกค้าที่ต้องการ", "ตรวจสอบประวัติและยอดชำระสะสม", "อัปเดตสถานะการชำระเงินในรายละเอียดรายการจอง"],
    },
  ];

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #f5f8fc; color: #203047; font-family: 'Prompt',sans-serif; }
        button,input,select,textarea { font: inherit; }
        button { cursor: pointer; }
        .app { min-height: 100vh; }
        .container { width: min(1240px,calc(100% - 40px)); margin: auto; }
        .topbar { background: white; border-bottom: 1px solid #e7edf5; position: sticky; top: 0; z-index: 20; }
        .nav { min-height: 76px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .brand { display: flex; align-items: center; gap: 11px; cursor: pointer; flex-shrink: 0; }
        .brand-icon { width: 46px; height: 46px; display: grid; place-items: center; color: white; border-radius: 14px; background: linear-gradient(135deg,#2788e8,#53b6ef); }
        .brand-name { font-size: 20px; font-weight: 700; color: #1d4e80; }
        .brand-sub { font-size: 11px; color: #8090a5; }
        .nav-links { display: flex; align-items: center; gap: 4px; }
        .nav-link { display: flex; align-items: center; gap: 6px; border: 0; background: transparent; color: #63748a; padding: 11px 12px; border-radius: 10px; font-size: 13px; white-space: nowrap; }
        .nav-link:hover,.nav-link.active { background: #edf6ff; color: #1675c9; }
        .menu-button { display: none; border: 0; background: #edf6ff; color: #1675c9; padding: 11px; border-radius: 10px; }
        .page { padding: 32px 0 65px; }
        .hero { padding: 45px; border-radius: 25px; background: linear-gradient(115deg,#e5f3ff,#f3faff 60%,#eaf8ff); display: grid; grid-template-columns: 1.35fr .65fr; gap: 25px; align-items: center; overflow: hidden; }
        .hero h1 { font-size: clamp(30px,4vw,45px); line-height: 1.4; color: #174d7f; margin: 12px 0; }
        .hero p { color: #617991; font-size: 15px; line-height: 1.9; max-width: 650px; }
        .hero-visual { min-height: 220px; display: grid; place-items: center; color: #4b9bdd; }
        .hero-visual svg { width: 170px; height: 170px; stroke-width: 1.2; }
        .eyebrow { color: #2487d3; font-size: 12px; font-weight: 600; letter-spacing: .5px; }
        .button { border: 0; border-radius: 11px; padding: 12px 18px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; font-size: 13px; transition: .2s; }
        .button:disabled { opacity: .5; cursor: not-allowed; }
        .primary { color: white; background: #2386d5; }
        .primary:hover { background: #176fb8; }
        .secondary { color: #247ac0; background: #eaf5ff; }
        .outline { color: #4e6781; background: white; border: 1px solid #dce6f0; }
        .danger { color: #c34c4c; background: #fff0f0; }
        .small-button { padding: 8px 11px; font-size: 12px; }
        .section { margin-top: 34px; }
        .section-head { display: flex; justify-content: space-between; align-items: center; gap: 15px; margin-bottom: 18px; }
        .section-head h2,.page-title { margin: 0; color: #254b70; font-size: 24px; }
        .section-head p { margin: 5px 0 0; color: #8392a5; font-size: 13px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 17px; }
        .grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 17px; }
        .card { background: white; border: 1px solid #e8eef5; border-radius: 17px; padding: 21px; box-shadow: 0 5px 18px rgba(30,70,110,.035); }
        .feature-icon { width: 47px; height: 47px; border-radius: 14px; background: #eaf5ff; color: #2386d5; display: grid; place-items: center; margin-bottom: 13px; }
        .card h3 { margin: 0 0 8px; font-size: 16px; color: #315675; }
        .muted { color: #8190a3; font-size: 12px; line-height: 1.8; }
        .shop-status { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; padding: 21px 23px; border-radius: 17px; margin-bottom: 24px; }
        .shop-status.open { background: #eaf8f0; border: 1px solid #ccebd9; }
        .shop-status.closed { background: #fff1f0; border: 1px solid #f2d2ce; }
        .status-main { display: flex; gap: 13px; align-items: flex-start; }
        .status-main h3 { margin: 0 0 4px; font-size: 17px; }
        .status-main p { margin: 0; font-size: 12px; color: #687d8d; line-height: 1.8; }
        .status-pill { display: inline-flex; padding: 6px 11px; border-radius: 30px; font-size: 11px; font-weight: 600; white-space: nowrap; }
        .status-pill.green { color: #218451; background: #d7f2e2; }
        .status-pill.red { color: #c04c48; background: #ffe0de; }
        .status-pill.blue { color: #2478bd; background: #e1f0ff; }
        .status-pill.orange { color: #a96b19; background: #fff0d7; }
        .product-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .product-card { overflow: hidden; padding: 0; }
        .product-visual { height: 155px; background: #edf6ff; display: grid; place-items: center; color: #70a9d7; overflow: hidden; }
        .product-visual svg { width: 55px; height: 55px; stroke-width: 1.4; }
        .product-visual img { width: 100%; height: 100%; object-fit: cover; }
        .product-info { padding: 15px; }
        .product-info h3 { margin: 0 0 5px; font-size: 15px; }
        .price { color: #2185d4; font-weight: 700; font-size: 17px; }
        .form-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 15px; }
        .field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
        .field label { color: #536b83; font-size: 12px; font-weight: 500; }
        .field input,.field select,.field textarea,.search-input { width: 100%; border: 1px solid #dce5ef; border-radius: 10px; padding: 12px 13px; background: white; color: #30465c; outline: none; font-size: 13px; }
        .field input:focus,.field select:focus,.field textarea:focus,.search-input:focus { border-color: #6cb3eb; box-shadow: 0 0 0 3px #e8f4ff; }
        .field textarea { min-height: 85px; resize: vertical; }
        .field input[type=file] { padding: 9px; background: #f8fbff; }
        .choice-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 13px; }
        .choice { border: 1px solid #dce6f0; background: white; border-radius: 14px; padding: 16px; display: flex; align-items: flex-start; gap: 11px; text-align: left; color: #4c657e; }
        .choice.selected { border: 2px solid #3694df; background: #f0f8ff; padding: 15px; }
        .choice h3 { margin: 0 0 5px; font-size: 14px; }
        .choice p { margin: 0; font-size: 11px; color: #8190a3; line-height: 1.7; }
        .quantity-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid #edf1f5; padding: 12px 0; }
        .quantity-controls { display: flex; align-items: center; gap: 11px; }
        .quantity-controls button { width: 31px; height: 31px; border: 0; border-radius: 8px; background: #edf6ff; color: #237fc7; display: grid; place-items: center; }
        .quantity { min-width: 20px; text-align: center; font-weight: 600; }
        .check-row { display: flex; align-items: center; gap: 9px; border: 1px solid #e3ebf3; border-radius: 11px; padding: 12px; color: #526a82; font-size: 13px; }
        .check-row input { width: 16px; height: 16px; accent-color: #2386d5; }
        .summary { background: #f1f8ff; border-radius: 14px; padding: 17px; }
        .summary-line { display: flex; justify-content: space-between; gap: 14px; margin: 8px 0; color: #637991; font-size: 12px; }
        .summary-total { border-top: 1px solid #dbeaf7; padding-top: 12px; margin-top: 12px; color: #1c6eaf; font-size: 18px; font-weight: 700; }
        .admin-layout { display: grid; grid-template-columns: 220px 1fr; gap: 18px; align-items: start; }
        .admin-menu { display: flex; flex-direction: column; gap: 5px; }
        .admin-menu button { display: flex; align-items: center; gap: 9px; border: 0; background: transparent; color: #61758b; text-align: left; padding: 12px; border-radius: 10px; font-size: 12px; }
        .admin-menu button.active,.admin-menu button:hover { background: #eaf5ff; color: #1679c5; }
        .admin-content { min-width: 0; }
        .admin-content h2 { margin: 0 0 17px; color: #315675; font-size: 20px; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; min-width: 620px; }
        th,td { padding: 12px 10px; border-bottom: 1px solid #edf1f5; text-align: left; font-size: 12px; vertical-align: middle; }
        th { color: #74879a; font-weight: 500; background: #f8fbfe; }
        td { color: #52677d; }
        .customer-row { display: flex; justify-content: space-between; align-items: center; gap: 13px; padding: 14px 0; border-bottom: 1px solid #edf1f5; }
        .customer-avatar { width: 43px; height: 43px; border-radius: 13px; background: #eaf5ff; color: #2386d5; display: grid; place-items: center; flex-shrink: 0; }
        .detail-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 11px; }
        .stat { background: #f5f9fd; border-radius: 12px; padding: 14px; }
        .stat small { display: block; color: #8392a5; font-size: 11px; }
        .stat strong { display: block; color: #286eaa; font-size: 19px; margin-top: 5px; }
        .image-preview { width: 100%; max-height: 200px; object-fit: contain; border-radius: 11px; background: #f1f6fb; margin-top: 8px; }
        .notice { position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%); z-index: 50; background: #244e72; color: white; padding: 12px 20px; border-radius: 11px; box-shadow: 0 8px 30px #183c5b33; font-size: 13px; max-width: calc(100% - 30px); text-align: center; }
        .footer { background: #eaf3fb; padding: 28px 0; color: #71869a; font-size: 12px; text-align: center; }
        .divider { border: 0; border-top: 1px solid #edf1f5; margin: 19px 0; }
        .empty { text-align: center; padding: 32px 15px; color: #8a9aac; }
        .empty svg { margin-bottom: 10px; color: #9abbd7; }
        .tag { display: inline-flex; padding: 5px 9px; border-radius: 8px; background: #f0f6fc; color: #67829a; font-size: 10px; }
        .section-note { padding: 12px 14px; background: #f3f8fd; color: #71879c; border-radius: 10px; font-size: 11px; line-height: 1.8; }
        .guide-tabs { display: flex; gap: 9px; margin: 20px 0; flex-wrap: wrap; }
        .guide-tabs button { border: 1px solid #dce6f0; background: white; color: #60778d; padding: 11px 17px; border-radius: 11px; font-size: 13px; display: flex; align-items: center; gap: 8px; }
        .guide-tabs button.active { background: #eaf5ff; color: #1979c4; border-color: #abd4f3; }
        .guide-intro { background: linear-gradient(110deg,#eaf5ff,#f6fbff); padding: 23px; border-radius: 15px; margin-bottom: 20px; }
        .guide-intro h2 { margin: 0 0 7px; color: #285c88; font-size: 20px; }
        .guide-card { display: grid; grid-template-columns: 54px 1fr; gap: 14px; margin-bottom: 13px; }
        .guide-icon { width: 52px; height: 52px; border-radius: 14px; display: grid; place-items: center; color: #2786ce; background: #eaf5ff; }
        .guide-card h3 { margin: 0 0 5px; color: #315675; font-size: 15px; }
        .guide-card p { margin: 0 0 10px; color: #7a8da1; font-size: 12px; line-height: 1.8; }
        .guide-steps { padding-left: 20px; margin: 0; color: #536d84; font-size: 12px; line-height: 2; }
        .guide-steps li::marker { color: #2786ce; font-weight: 700; }
        @media(max-width:1050px) {
          .nav-links { display: none; }
          .menu-button { display: inline-flex; }
          .nav-links.mobile-open { display: flex; position: absolute; top: 76px; left: 0; right: 0; background: white; padding: 13px 20px; flex-direction: column; align-items: stretch; border-bottom: 1px solid #e7edf5; }
          .nav-link { justify-content: flex-start; }
          .hero { padding: 32px; grid-template-columns: 1fr .4fr; }
          .product-grid { grid-template-columns: repeat(2,1fr); }
          .admin-layout { grid-template-columns: 1fr; }
          .admin-menu { display: grid; grid-template-columns: repeat(3,1fr); }
          .admin-menu button { justify-content: center; }
        }
        @media(max-width:650px) {
          .container { width: min(100% - 26px,1240px); }
          .page { padding-top: 22px; }
          .hero { grid-template-columns: 1fr; padding: 24px; }
          .hero-visual { min-height: 90px; }
          .hero-visual svg { width: 95px; height: 95px; }
          .grid-3,.grid-2,.form-grid,.choice-grid { grid-template-columns: 1fr; }
          .product-grid { grid-template-columns: repeat(2,1fr); gap: 10px; }
          .product-visual { height: 120px; }
          .card { padding: 16px; }
          .shop-status { flex-direction: column; }
          .section-head { align-items: flex-start; flex-direction: column; }
          .admin-menu { grid-template-columns: repeat(2,1fr); }
          .detail-grid { grid-template-columns: 1fr; }
          .brand-name { font-size: 18px; }
          .guide-card { grid-template-columns: 43px 1fr; gap: 10px; }
          .guide-icon { width: 42px; height: 42px; }
        }
      `}</style>

      <header className="topbar">
        <div className="container nav">
          <div className="brand" onClick={() => goTo("home")}>
            <div className="brand-icon"><WashingMachine size={26} /></div>
            <div>
              <div className="brand-name">DEMO Laundry</div>
              <div className="brand-sub">ระบบจัดการร้านซักอบรีด</div>
            </div>
          </div>

          <button className="menu-button" onClick={() => setMobileMenu(!mobileMenu)}>
            <Menu size={22} />
          </button>

          <nav className={`nav-links ${mobileMenu ? "mobile-open" : ""}`}>
            {navItems.map(([id, label, Icon]) => (
              <button
                key={id}
                className={`nav-link ${page === id ? "active" : ""}`}
                onClick={() => goTo(id)}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container page">
        {page === "home" && (
          <>
            <div className={`shop-status ${shopOpen ? "open" : "closed"}`}>
              <div className="status-main">
                <Store size={29} color={shopOpen ? "#26965e" : "#cf5b55"} />
                <div>
                  <h3>{shopOpen ? "ร้านเปิดให้บริการ" : "ร้านปิดให้บริการชั่วคราว"}</h3>
                  <p>{shopMessage}</p>
                  {!shopOpen && <p style={{ marginTop: 5 }}>เหตุผล: {shopReason}</p>}
                </div>
              </div>
              <span className={`status-pill ${shopOpen ? "green" : "red"}`}>
                {shopOpen ? "เปิดให้บริการ" : "ปิดให้บริการ"}
              </span>
            </div>

            <section className="hero">
              <div>
                <div className="eyebrow">WELCOME TO DEMO LAUNDRY</div>
                <h1>ดูแลเสื้อผ้าของคุณ<br />ให้สะอาด หอม สดชื่น</h1>
                <p>
                  บริการซัก อบ รีด พร้อมตัวเลือกนำผ้ามาส่งที่ร้าน
                  หรือเรียกให้ร้านไปรับผ้าถึงบ้านและนำไปส่งคืน
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
                  <button className="button primary" onClick={() => goTo("booking")} disabled={!shopOpen}>
                    <CalendarDays size={17} /> จองคิวใช้บริการ
                  </button>
                  <button className="button secondary" onClick={() => goTo("guide")}>
                    <BookOpen size={17} /> อ่านคู่มือ
                  </button>
                </div>
                {!shopOpen && <p style={{ color: "#c4514b" }}>ขณะนี้ร้านปิด จึงยังไม่สามารถจองคิวได้</p>}
              </div>
              <div className="hero-visual"><WashingMachine /></div>
            </section>

            <section className="section">
              <div className="section-head">
                <div>
                  <h2>เลือกรูปแบบการใช้บริการ</h2>
                  <p>เลือกวิธีใช้บริการได้ตามความสะดวก</p>
                </div>
              </div>
              <div className="grid-2">
                <div className="card">
                  <div className="feature-icon"><Store size={24} /></div>
                  <h3>นำผ้ามาส่งที่ร้าน</h3>
                  <p className="muted">ลูกค้านำผ้ามาที่ร้าน เลือกประเภทผ้าและบริการที่ต้องการ แล้วมารับคืนที่ร้าน</p>
                  <button className="button secondary" onClick={() => goTo("booking")}>จองบริการนี้ <ChevronRight size={15} /></button>
                </div>
                <div className="card">
                  <div className="feature-icon"><Truck size={24} /></div>
                  <h3>เรียกให้ร้านไปรับผ้า</h3>
                  <p className="muted">ลูกค้าแจ้งที่อยู่ วันและเวลาที่สะดวก ร้านเข้ารับผ้าและนำไปส่งคืน</p>
                  <button className="button secondary" onClick={() => {
                    setForm((prev) => ({ ...prev, method: "pickup" }));
                    goTo("booking");
                  }}>เรียกรับผ้า <ChevronRight size={15} /></button>
                </div>
              </div>
            </section>

            <section className="section">
              <div className="section-head">
                <div><h2>บริการของเรา</h2><p>เลือกบริการที่ต้องการได้</p></div>
                <button className="button outline small-button" onClick={() => goTo("services")}>ดูทั้งหมด</button>
              </div>
              <div className="grid-3">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div className="card" key={service.id}>
                      <div className="feature-icon"><Icon size={24} /></div>
                      <h3>{service.name}</h3>
                      <p className="muted">{service.description}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="section">
              <div className="section-head">
                <div><h2>ประเภทผ้าที่รับบริการ</h2><p>รายการตัวอย่างและราคาเริ่มต้น</p></div>
                <button className="button outline small-button" onClick={() => goTo("catalog")}>ดูทั้งหมด</button>
              </div>
              <div className="product-grid">
                {clothing.slice(0, 4).map((item) => (
                  <div className="card product-card" key={item.id}>
                    <div className="product-visual">
                      {item.image ? <img src={item.image} alt={item.name} /> : <Shirt />}
                    </div>
                    <div className="product-info">
                      <h3>{item.name}</h3>
                      <div className="price">{money(item.price)} บาท</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {page === "services" && (
          <>
            <div className="section-head">
              <div>
                <div className="eyebrow">OUR SERVICES</div>
                <h1 className="page-title">บริการของเรา</h1>
                <p className="muted">เลือกบริการที่ต้องการได้ในขั้นตอนการจองคิว</p>
              </div>
            </div>
            <div className="grid-3">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div className="card" key={service.id}>
                    <div className="feature-icon"><Icon size={24} /></div>
                    <h3>{service.name}</h3>
                    <p className="muted">{service.description}</p>
                    <span className="tag">
                      {service.price ? `ตัวอย่าง +${service.price} บาท/ชิ้น` : "คิดราคาตามประเภทผ้า"}
                    </span>
                  </div>
                );
              })}
            </div>
            <section className="section">
              <h2 className="page-title">รูปแบบการรับผ้า</h2>
              <div className="grid-2" style={{ marginTop: 17 }}>
                <div className="card">
                  <div className="feature-icon"><Store size={24} /></div>
                  <h3>ลูกค้านำผ้ามาส่งเอง</h3>
                  <p className="muted">นำผ้ามาที่ร้านและมารับคืนที่ร้านเมื่อดำเนินการเสร็จ</p>
                </div>
                <div className="card">
                  <div className="feature-icon"><Truck size={24} /></div>
                  <h3>ร้านไปรับและส่งคืน</h3>
                  <p className="muted">ร้านเข้ารับผ้าตามที่อยู่ที่ลูกค้าแจ้ง และนำผ้าไปส่งคืน</p>
                </div>
              </div>
            </section>
          </>
        )}

        {page === "catalog" && (
          <>
            <div className="section-head">
              <div>
                <div className="eyebrow">CLOTHING CATALOG</div>
                <h1 className="page-title">รายการประเภทผ้า</h1>
                <p className="muted">เลือกดูประเภทผ้าและราคาเบื้องต้นของร้าน</p>
              </div>
            </div>
            <div className="product-grid">
              {clothing.map((item) => (
                <div className="card product-card" key={item.id}>
                  <div className="product-visual">
                    {item.image ? <img src={item.image} alt={item.name} /> : <Shirt />}
                  </div>
                  <div className="product-info">
                    <span className="tag">{item.category}</span>
                    <h3 style={{ marginTop: 8 }}>{item.name}</h3>
                    <div className="price">{money(item.price)} บาท</div>
                    <p className="muted">ราคาซักเริ่มต้นต่อชิ้น</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {page === "booking" && (
          <>
            <div className="section-head">
              <div>
                <div className="eyebrow">BOOKING</div>
                <h1 className="page-title">จองคิวใช้บริการ</h1>
                <p className="muted">กรอกข้อมูล เลือกประเภทผ้าและบริการที่ต้องการ</p>
              </div>
            </div>

            {!shopOpen ? (
              <div className="card" style={{ textAlign: "center", padding: 40 }}>
                <Store size={42} color="#cc6159" />
                <h2 style={{ color: "#bd514b" }}>ร้านปิดให้บริการชั่วคราว</h2>
                <p className="muted">{shopMessage}</p>
                <p className="muted">เหตุผล: {shopReason}</p>
                <button className="button outline" onClick={() => goTo("home")}>กลับหน้าแรก</button>
              </div>
            ) : (
              <form onSubmit={submitBooking}>
                <div className="card" style={{ marginBottom: 17 }}>
                  <h2 style={{ fontSize: 18, color: "#315675", margin: "0 0 16px" }}>1. เลือกรูปแบบการใช้บริการ</h2>
                  <div className="choice-grid">
                    <button type="button" className={`choice ${form.method === "dropoff" ? "selected" : ""}`} onClick={() => updateForm("method", "dropoff")}>
                      <Store size={26} color="#2788d3" />
                      <div><h3>นำผ้ามาส่งที่ร้าน</h3><p>ลูกค้านำผ้ามาส่งและมารับคืนที่ร้าน</p></div>
                    </button>
                    <button type="button" className={`choice ${form.method === "pickup" ? "selected" : ""}`} onClick={() => updateForm("method", "pickup")}>
                      <Truck size={26} color="#2788d3" />
                      <div><h3>เรียกให้ร้านไปรับผ้า</h3><p>ร้านไปรับผ้าและนำไปส่งคืนให้ลูกค้า</p></div>
                    </button>
                  </div>

                  {form.method === "pickup" && (
                    <div style={{ marginTop: 18 }}>
                      <div className="section-note" style={{ marginBottom: 14 }}>
                        กรุณาระบุที่อยู่ วันและเวลาที่สะดวกให้ร้านเข้ารับผ้า
                      </div>
                      <div className="field">
                        <label>ที่อยู่สำหรับเข้ารับผ้าและส่งคืน *</label>
                        <textarea value={form.address} onChange={(e) => updateForm("address", e.target.value)} placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ หรือจุดสังเกต" />
                      </div>
                      <div className="form-grid">
                        <div className="field">
                          <label>วันที่ต้องการให้เข้ารับผ้า *</label>
                          <input type="date" value={form.pickupDate} onChange={(e) => updateForm("pickupDate", e.target.value)} />
                        </div>
                        <div className="field">
                          <label>เวลาที่สะดวก *</label>
                          <input type="time" value={form.pickupTime} onChange={(e) => updateForm("pickupTime", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="card" style={{ marginBottom: 17 }}>
                  <h2 style={{ fontSize: 18, color: "#315675", margin: "0 0 15px" }}>2. ข้อมูลลูกค้า</h2>
                  <div className="form-grid">
                    <div className="field">
                      <label>ชื่อผู้ใช้บริการ *</label>
                      <input value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="กรอกชื่อ-นามสกุล" />
                    </div>
                    <div className="field">
                      <label>เบอร์โทรศัพท์ *</label>
                      <input type="tel" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="กรอกเบอร์โทรศัพท์" />
                    </div>
                  </div>
                </div>

                <div className="card" style={{ marginBottom: 17 }}>
                  <h2 style={{ fontSize: 18, color: "#315675", margin: "0 0 7px" }}>3. เลือกประเภทผ้าและจำนวน</h2>
                  <p className="muted">กดปุ่มบวกและลบเพื่อกำหนดจำนวนผ้าที่ต้องการส่งซัก</p>
                  {clothing.map((item) => {
                    const selected = form.items.find((entry) => entry.clothingId === item.id);
                    return (
                      <div className="quantity-row" key={item.id}>
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          <div style={{ width: 43, height: 43, borderRadius: 9, overflow: "hidden", background: "#edf6ff", display: "grid", placeItems: "center", color: "#70a9d7", flexShrink: 0 }}>
                            {item.image ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Shirt size={22} />}
                          </div>
                          <div><strong style={{ fontSize: 13 }}>{item.name}</strong><div className="muted">{money(item.price)} บาท/ชิ้น</div></div>
                        </div>
                        <div className="quantity-controls">
                          <button type="button" onClick={() => changeQuantity(item, -1)}><Minus size={14} /></button>
                          <span className="quantity">{selected?.quantity || 0}</span>
                          <button type="button" onClick={() => changeQuantity(item, 1)}><Plus size={14} /></button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="summary-line" style={{ marginTop: 13 }}>
                    <span>จำนวนผ้าทั้งหมด</span><strong>{totalItems} ชิ้น</strong>
                  </div>
                </div>

                <div className="card" style={{ marginBottom: 17 }}>
                  <h2 style={{ fontSize: 18, color: "#315675", margin: "0 0 15px" }}>4. เลือกบริการที่ต้องการ</h2>
                  <div className="grid-3">
                    {services.map((service) => {
                      const Icon = service.icon;
                      return (
                        <label className="check-row" key={service.id}>
                          <input type="checkbox" checked={form.services.includes(service.id)} disabled={service.id === "ซัก"} onChange={() => toggleService(service.id)} />
                          <Icon size={20} color="#2788d3" />
                          <span>{service.name}<small style={{ display: "block", color: "#8a9aac" }}>{service.price ? `+${service.price} บาท/ชิ้น` : "บริการหลัก"}</small></span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="field" style={{ marginTop: 17, marginBottom: 0 }}>
                    <label>หมายเหตุหรือคำแนะนำเพิ่มเติม</label>
                    <textarea value={form.note} onChange={(e) => updateForm("note", e.target.value)} placeholder="เช่น แยกผ้าสีและผ้าขาว ไม่ใช้น้ำยาปรับผ้านุ่ม หรือคำแนะนำอื่น ๆ" />
                  </div>
                </div>

                <div className="card" style={{ marginBottom: 17 }}>
                  <h2 style={{ fontSize: 18, color: "#315675", margin: "0 0 15px" }}>5. วิธีชำระเงิน</h2>
                  <div className="choice-grid">
                    <button type="button" className={`choice ${form.paymentMethod === "โอนเงินก่อนส่งคืน" ? "selected" : ""}`} onClick={() => updateForm("paymentMethod", "โอนเงินก่อนส่งคืน")}>
                      <CreditCard size={24} color="#2788d3" />
                      <div><h3>โอนเงินก่อนส่งคืน</h3><p>ตัวอย่างพื้นที่แสดง QR และแนบสลิป</p></div>
                    </button>
                    <button type="button" className={`choice ${form.paymentMethod === "ชำระตอนรับผ้าคืน" ? "selected" : ""}`} onClick={() => updateForm("paymentMethod", "ชำระตอนรับผ้าคืน")}>
                      <Banknote size={24} color="#2788d3" />
                      <div><h3>ชำระตอนรับผ้าคืน</h3><p>ชำระเมื่อมารับผ้าหรือเมื่อร้านนำไปส่งคืน</p></div>
                    </button>
                  </div>
                  {form.paymentMethod === "โอนเงินก่อนส่งคืน" && (
                    <div className="section-note" style={{ marginTop: 14, textAlign: "center" }}>
                      <strong>ตัวอย่างพื้นที่แสดง QR Code สำหรับชำระเงิน</strong>
                      <div style={{ width: 120, height: 120, margin: "13px auto", background: "white", border: "1px dashed #9bbbd6", display: "grid", placeItems: "center", color: "#91a8bd", borderRadius: 10 }}>
                        <div><CreditCard size={30} /><br />QR ตัวอย่าง</div>
                      </div>
                      QR นี้เป็นเพียงตัวอย่าง DEMO ไม่ใช่ QR สำหรับรับเงินจริง
                    </div>
                  )}
                </div>

                <div className="card">
                  <h2 style={{ fontSize: 18, color: "#315675", margin: "0 0 15px" }}>สรุปรายการจอง</h2>
                  {form.items.map((item) => (
                    <div className="summary-line" key={item.clothingId}>
                      <span>{item.name} × {item.quantity}</span>
                      <strong>{money(item.price * item.quantity)} บาท</strong>
                    </div>
                  ))}
                  {form.services.includes("อบ") && <div className="summary-line"><span>บริการอบผ้า</span><strong>{money(totalItems * 5)} บาท</strong></div>}
                  {form.services.includes("รีด") && <div className="summary-line"><span>บริการรีดผ้า</span><strong>{money(totalItems * 5)} บาท</strong></div>}
                  <div className="summary-total">
                    <div className="summary-line" style={{ color: "inherit", fontSize: 17 }}>
                      <span>ยอดรวมตัวอย่าง</span><strong>{money(bookingTotal)} บาท</strong>
                    </div>
                  </div>
                  <p className="muted">* ราคาเป็นตัวอย่างสำหรับเว็บไซต์ DEMO</p>
                  <button className="button primary" type="submit" style={{ width: "100%", marginTop: 9 }}>
                    <Check size={17} /> ยืนยันการจองคิว
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {page === "guide" && (
          <>
            <div className="section-head">
              <div>
                <div className="eyebrow">USER GUIDE</div>
                <h1 className="page-title">คู่มือการใช้งานเว็บไซต์</h1>
                <p className="muted">คำแนะนำการใช้งานระบบ DEMO Laundry ทีละขั้นตอน</p>
              </div>
            </div>

            <div className="guide-intro">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="feature-icon" style={{ margin: 0, background: "white" }}>
                  <BookOpen size={25} />
                </div>
                <div>
                  <h2>ยินดีต้อนรับสู่คู่มือการใช้งาน</h2>
                  <p className="muted" style={{ margin: 0 }}>
                    เลือกหมวดคู่มือที่ต้องการอ่าน เพื่อเรียนรู้วิธีใช้งานเว็บไซต์
                  </p>
                </div>
              </div>
            </div>

            <div className="guide-tabs">
              <button className={guideTab === "customer" ? "active" : ""} onClick={() => setGuideTab("customer")}>
                <User size={17} /> คู่มือสำหรับลูกค้า
              </button>
              <button className={guideTab === "admin" ? "active" : ""} onClick={() => setGuideTab("admin")}>
                <Settings size={17} /> คู่มือสำหรับเจ้าของร้าน
              </button>
            </div>

            <div className="section-note" style={{ marginBottom: 17 }}>
              {guideTab === "customer"
                ? "ส่วนนี้อธิบายวิธีใช้บริการสำหรับลูกค้า ตั้งแต่ตรวจสอบร้านจนถึงยืนยันการจอง"
                : "ส่วนนี้อธิบายวิธีจัดการเว็บไซต์สำหรับเจ้าของร้าน ตั้งแต่ตั้งค่าสถานะร้านจนถึงดูประวัติลูกค้า"}
            </div>

            {(guideTab === "customer" ? guideCustomer : guideAdmin).map((guide, index) => {
              const Icon = guide.icon;
              return (
                <div className="card guide-card" key={guide.title}>
                  <div className="guide-icon"><Icon size={24} /></div>
                  <div>
                    <h3>{index + 1}. {guide.title}</h3>
                    <p>{guide.description}</p>
                    <ol className="guide-steps">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              );
            })}

            <div className="section-note" style={{ marginTop: 20 }}>
              <strong>หมายเหตุ:</strong> คู่มือนี้เป็นส่วนหนึ่งของเว็บไซต์ สามารถกลับมาเปิดอ่านได้ทุกเวลา โดยเลือกเมนู “คู่มือการใช้งาน” บนแถบเมนูด้านบน
            </div>
            <button className="button primary" style={{ marginTop: 20 }} onClick={() => goTo("home")}>
              <Home size={16} /> กลับหน้าแรก
            </button>
          </>
        )}

        {page === "admin" && (
          <>
            <div className="section-head">
              <div>
                <div className="eyebrow">ADMINISTRATION</div>
                <h1 className="page-title">ระบบจัดการร้าน</h1>
                <p className="muted">จัดการคิวงาน ลูกค้า ประเภทผ้า ผลิตภัณฑ์ และสถานะร้าน</p>
              </div>
            </div>

            <div className="admin-layout">
              <aside className="card admin-menu">
                {[
                  ["bookings", ClipboardList, "จัดการรายการจอง"],
                  ["customers", Users, "ประวัติลูกค้า"],
                  ["clothing", Shirt, "จัดการประเภทผ้า"],
                  ["products", Package, "ผลิตภัณฑ์ซักรีด"],
                  ["shop", Store, "สถานะร้าน"],
                ].map(([id, Icon, label]) => (
                  <button key={id} className={adminTab === id ? "active" : ""} onClick={() => {
                    setAdminTab(id);
                    setSelectedBookingId(null);
                    if (id !== "customers") setSelectedCustomer(null);
                  }}>
                    <Icon size={17} /> {label}
                  </button>
                ))}
              </aside>

              <section className="card admin-content">
                {adminTab === "bookings" && (
                  <>
                    <h2>จัดการรายการจองและงานซักรีด</h2>
                    {!selectedBooking ? (
                      <>
                        <div className="detail-grid" style={{ marginBottom: 18 }}>
                          <div className="stat"><small>รายการจองทั้งหมด</small><strong>{bookings.length}</strong></div>
                          <div className="stat"><small>รอดำเนินการ</small><strong>{bookings.filter((b) => b.status !== "เสร็จสิ้น").length}</strong></div>
                          <div className="stat"><small>เสร็จสิ้น</small><strong>{bookings.filter((b) => b.status === "เสร็จสิ้น").length}</strong></div>
                        </div>
                        {bookings.length === 0 ? (
                          <div className="empty"><ClipboardList size={35} /><p>ยังไม่มีรายการจอง</p></div>
                        ) : (
                          <div className="table-wrap">
                            <table>
                              <thead>
                                <tr><th>เลขที่จอง</th><th>ลูกค้า</th><th>รูปแบบบริการ</th><th>ยอดรวม</th><th>สถานะงาน</th><th>รายละเอียด</th></tr>
                              </thead>
                              <tbody>
                                {bookings.map((booking) => (
                                  <tr key={booking.id}>
                                    <td>{booking.id}</td>
                                    <td>{booking.name}<br /><small>{booking.phone}</small></td>
                                    <td>{booking.method === "pickup" ? "ร้านไปรับ–ส่ง" : "นำมาส่งที่ร้าน"}</td>
                                    <td>{money(booking.total)} บาท</td>
                                    <td><span className={`status-pill ${statusColor(booking.status)}`}>{booking.status}</span></td>
                                    <td><button className="button secondary small-button" onClick={() => setSelectedBookingId(booking.id)}><Eye size={13} /> ดูรายละเอียด</button></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <button className="button outline small-button" onClick={() => setSelectedBookingId(null)} style={{ marginBottom: 15 }}>
                          <ArrowLeft size={14} /> กลับรายการจอง
                        </button>
                        <h3>รายละเอียดรายการ {selectedBooking.id}</h3>
                        <div className="detail-grid" style={{ margin: "14px 0" }}>
                          <div className="stat"><small>ชื่อลูกค้า</small><strong style={{ fontSize: 15 }}>{selectedBooking.name}</strong></div>
                          <div className="stat"><small>เบอร์โทรศัพท์</small><strong style={{ fontSize: 15 }}>{selectedBooking.phone}</strong></div>
                          <div className="stat"><small>ยอดรวม</small><strong>{money(selectedBooking.total)} บาท</strong></div>
                        </div>
                        <div className="section-note">
                          <strong>รูปแบบบริการ:</strong> {selectedBooking.method === "pickup" ? "ร้านไปรับและส่งคืน" : "ลูกค้านำผ้ามาส่งที่ร้าน"}
                          {selectedBooking.method === "pickup" && <>
                            <br /><strong>ที่อยู่:</strong> {selectedBooking.address}
                            <br /><strong>วันเข้ารับ:</strong> {selectedBooking.pickupDate} เวลา {selectedBooking.pickupTime}
                          </>}
                          <br /><strong>วันที่จอง:</strong> {dateText(selectedBooking.createdAt)}
                          <br /><strong>หมายเหตุ:</strong> {selectedBooking.note || "-"}
                        </div>

                        <h3 style={{ marginTop: 20 }}>รายการผ้าและบริการ</h3>
                        {selectedBooking.items.map((item, index) => (
                          <div className="summary-line" key={index}>
                            <span>{item.name} × {item.quantity}</span><strong>{money(item.price * item.quantity)} บาท</strong>
                          </div>
                        ))}
                        <div className="summary-line"><span>บริการที่เลือก</span><strong>{selectedBooking.services.join(", ")}</strong></div>

                        <div className="form-grid" style={{ marginTop: 20 }}>
                          <div className="field">
                            <label>สถานะการดำเนินงาน</label>
                            <select value={selectedBooking.status} onChange={(e) => updateBooking(selectedBooking.id, { status: e.target.value })}>
                              {["รอตรวจรับผ้า", "รอเข้ารับผ้า", "รับผ้าแล้ว", "กำลังดำเนินการ", "กำลังซัก", "กำลังอบ", "กำลังรีด", "พร้อมส่งคืน", "กำลังจัดส่ง", "ส่งคืนแล้ว", "เสร็จสิ้น", "ยกเลิก"].map((status) => <option key={status}>{status}</option>)}
                            </select>
                          </div>
                          <div className="field">
                            <label>สถานะการชำระเงิน</label>
                            <select value={selectedBooking.paymentStatus} onChange={(e) => updateBooking(selectedBooking.id, { paymentStatus: e.target.value })}>
                              {["รอชำระเงิน", "รอตรวจสอบสลิป", "ชำระเงินแล้ว"].map((status) => <option key={status}>{status}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="field">
                          <label>ผลิตภัณฑ์ที่ใช้กับงานนี้</label>
                          <div className="grid-2">
                            {products.map((product) => (
                              <label className="check-row" key={product.id}>
                                <input
                                  type="checkbox"
                                  checked={(selectedBooking.detergents || []).includes(product.name)}
                                  onChange={(e) => {
                                    const current = selectedBooking.detergents || [];
                                    const next = e.target.checked
                                      ? [...current, product.name]
                                      : current.filter((name) => name !== product.name);
                                    updateBooking(selectedBooking.id, { detergents: next });
                                  }}
                                />
                                {product.name}
                              </label>
                            ))}
                          </div>
                        </div>

                        <hr className="divider" />
                        <h3>ภาพถ่ายประกอบการให้บริการ</h3>
                        <div className="section-note">
                          ถ่ายภาพตำหนิเฉพาะผ้าที่มีตำหนิอยู่ก่อนรับผ้า เช่น รอยขาดหรือรอยเปื้อน ไม่จำเป็นต้องถ่ายทุกชิ้น และถ่ายภาพหลักฐานตอนส่งคืนผ้า
                        </div>
                        <div className="form-grid" style={{ marginTop: 14 }}>
                          <div className="field">
                            <label><Camera size={14} style={{ verticalAlign: "middle" }} /> ภาพตำหนิก่อนซัก (ถ้ามี)</label>
                            <input type="file" accept="image/*" onChange={(e) => readImage(e.target.files[0], (image) => updateBooking(selectedBooking.id, { defectImage: image }))} />
                            {selectedBooking.defectImage && <img className="image-preview" src={selectedBooking.defectImage} alt="ภาพตำหนิก่อนซัก" />}
                          </div>
                          <div className="field">
                            <label><Camera size={14} style={{ verticalAlign: "middle" }} /> ภาพหลักฐานตอนส่งคืน</label>
                            <input type="file" accept="image/*" onChange={(e) => readImage(e.target.files[0], (image) => updateBooking(selectedBooking.id, { returnImage: image }))} />
                            {selectedBooking.returnImage && <img className="image-preview" src={selectedBooking.returnImage} alt="ภาพหลักฐานตอนส่งคืน" />}
                          </div>
                        </div>
                        <div className="field">
                          <label>วันที่และเวลาส่งคืน</label>
                          <input type="datetime-local" value={selectedBooking.returnDate || ""} onChange={(e) => updateBooking(selectedBooking.id, { returnDate: e.target.value })} />
                        </div>
                        <div className="section-note">
                          วิธีชำระเงิน: {selectedBooking.paymentMethod}
                          <br />สถานะปัจจุบัน: {selectedBooking.paymentStatus}
                          <br />การตรวจสอบสลิปเป็นการตรวจสอบโดยเจ้าของร้านใน DEMO นี้
                        </div>
                      </>
                    )}
                  </>
                )}

                {adminTab === "customers" && (
                  <>
                    <h2>ประวัติลูกค้า</h2>
                    {!activeCustomer ? (
                      <>
                        <div className="field">
                          <label>ค้นหาด้วยชื่อลูกค้าหรือเบอร์โทรศัพท์</label>
                          <div style={{ position: "relative" }}>
                            <Search size={17} style={{ position: "absolute", left: 13, top: 13, color: "#91a3b5" }} />
                            <input className="search-input" style={{ paddingLeft: 40 }} value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} placeholder="ค้นหาชื่อหรือเบอร์โทรศัพท์" />
                          </div>
                        </div>
                        <div className="section-note" style={{ marginBottom: 14 }}>
                          ระบบรวมประวัติจากเบอร์โทรศัพท์เดียวกัน เมื่อลูกค้าจองครั้งใหม่ด้วยเบอร์เดิม รายการจะถูกรวมไว้ในประวัติของลูกค้าคนนั้น
                        </div>
                        {filteredCustomers.length === 0 ? (
                          <div className="empty"><Users size={35} /><p>ไม่พบข้อมูลลูกค้า</p></div>
                        ) : filteredCustomers.map((customer) => (
                          <div className="customer-row" key={customer.key}>
                            <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                              <div className="customer-avatar"><User size={21} /></div>
                              <div>
                                <strong>{customer.name}</strong>
                                <div className="muted">{customer.phone || "ไม่มีเบอร์โทรศัพท์"}</div>
                                <div className="muted">ใช้บริการ {customer.count} ครั้ง</div>
                              </div>
                            </div>
                            <button className="button secondary small-button" onClick={() => setSelectedCustomer(customer.key)}>ดูประวัติ <ChevronRight size={13} /></button>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        <button className="button outline small-button" onClick={() => setSelectedCustomer(null)} style={{ marginBottom: 15 }}><ArrowLeft size={14} /> กลับรายชื่อลูกค้า</button>
                        <h3>{activeCustomer.name}</h3>
                        <p className="muted"><Phone size={13} style={{ verticalAlign: "middle" }} /> {activeCustomer.phone || "ไม่มีเบอร์โทรศัพท์"}</p>
                        <div className="detail-grid" style={{ margin: "17px 0" }}>
                          <div className="stat"><small>จำนวนครั้งที่ใช้บริการ</small><strong>{activeCustomer.count}</strong></div>
                          <div className="stat"><small>ยอดชำระสะสม</small><strong>{money(activeCustomer.paid)} บาท</strong></div>
                          <div className="stat"><small>ยอดใช้บริการรวม</small><strong>{money(activeCustomer.total)} บาท</strong></div>
                        </div>
                        <h3>ประวัติการใช้บริการทั้งหมด</h3>
                        {activeCustomer.bookings.map((booking) => (
                          <div className="card" key={booking.id} style={{ marginTop: 12, background: "#fbfdff" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                              <strong>{booking.id}</strong>
                              <span className={`status-pill ${statusColor(booking.status)}`}>{booking.status}</span>
                            </div>
                            <p className="muted">{dateText(booking.createdAt)}</p>
                            <p className="muted">รูปแบบบริการ: {booking.method === "pickup" ? "ร้านไปรับและส่งคืน" : "ลูกค้านำมาส่งที่ร้าน"}</p>
                            <div className="summary-line"><span>รายการผ้า</span><strong>{booking.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</strong></div>
                            <div className="summary-line"><span>บริการ</span><strong>{booking.services.join(", ")}</strong></div>
                            <div className="summary-line"><span>ยอดรวม</span><strong>{money(booking.total)} บาท</strong></div>
                            <div className="summary-line"><span>การชำระเงิน</span><strong>{booking.paymentStatus}</strong></div>
                            {booking.note && <p className="muted">หมายเหตุ: {booking.note}</p>}
                            <button className="button secondary small-button" onClick={() => {
                              setSelectedBookingId(booking.id);
                              setAdminTab("bookings");
                            }}>ดูรายละเอียดงาน</button>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}

                {adminTab === "clothing" && (
                  <>
                    <h2>จัดการประเภทผ้า</h2>
                    <div className="section-note" style={{ marginBottom: 16 }}>
                      เพิ่มประเภทผ้า กำหนดราคา และอัปโหลดรูปภาพจริงเพื่อให้ลูกค้าเห็นในหน้ารายการผ้า
                    </div>
                    <form onSubmit={addClothing}>
                      <div className="form-grid">
                        <div className="field">
                          <label>ชื่อประเภทผ้า</label>
                          <input value={newClothing.name} onChange={(e) => setNewClothing({ ...newClothing, name: e.target.value })} placeholder="เช่น เสื้อโปโล" />
                        </div>
                        <div className="field">
                          <label>ราคาเริ่มต้น (บาท)</label>
                          <input type="number" min="0" value={newClothing.price} onChange={(e) => setNewClothing({ ...newClothing, price: e.target.value })} placeholder="0" />
                        </div>
                        <div className="field">
                          <label>หมวดหมู่</label>
                          <select value={newClothing.category} onChange={(e) => setNewClothing({ ...newClothing, category: e.target.value })}>
                            <option>เสื้อผ้า</option><option>เครื่องนอน</option><option>ผ้าอื่น ๆ</option>
                          </select>
                        </div>
                        <div className="field">
                          <label>รูปภาพประเภทผ้า</label>
                          <input type="file" accept="image/*" onChange={(e) => readImage(e.target.files[0], (image) => setNewClothing((prev) => ({ ...prev, image })))} />
                        </div>
                      </div>
                      {newClothing.image && <img className="image-preview" src={newClothing.image} alt="ตัวอย่างรูปประเภทผ้า" />}
                      <button className="button primary" type="submit" style={{ marginTop: 10 }}><Plus size={16} /> เพิ่มประเภทผ้า</button>
                    </form>

                    <hr className="divider" />
                    <h3>รายการประเภทผ้าที่มีในร้าน</h3>
                    {clothing.map((item) => (
                      <div className="customer-row" key={item.id}>
                        <div style={{ display: "flex", gap: 11, alignItems: "center", minWidth: 0 }}>
                          <div style={{ width: 55, height: 55, borderRadius: 10, background: "#edf6ff", overflow: "hidden", display: "grid", placeItems: "center", color: "#70a9d7", flexShrink: 0 }}>
                            {item.image ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Shirt size={25} />}
                          </div>
                          <div><strong>{item.name}</strong><div className="muted">{item.category} · {money(item.price)} บาท</div></div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="button secondary small-button" onClick={() => setEditingClothing({ ...item })}><Edit size={13} /> แก้ไข</button>
                          <button className="button danger small-button" onClick={() => deleteClothing(item.id)}><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}

                    {editingClothing && (
                      <div className="card" style={{ marginTop: 18, background: "#f8fbff" }}>
                        <h3>แก้ไขประเภทผ้า</h3>
                        <div className="form-grid">
                          <div className="field">
                            <label>ชื่อประเภทผ้า</label>
                            <input value={editingClothing.name} onChange={(e) => setEditingClothing({ ...editingClothing, name: e.target.value })} />
                          </div>
                          <div className="field">
                            <label>ราคา</label>
                            <input type="number" min="0" value={editingClothing.price} onChange={(e) => setEditingClothing({ ...editingClothing, price: e.target.value })} />
                          </div>
                          <div className="field">
                            <label>หมวดหมู่</label>
                            <select value={editingClothing.category} onChange={(e) => setEditingClothing({ ...editingClothing, category: e.target.value })}>
                              <option>เสื้อผ้า</option><option>เครื่องนอน</option><option>ผ้าอื่น ๆ</option>
                            </select>
                          </div>
                          <div className="field">
                            <label>เปลี่ยนรูปภาพ</label>
                            <input type="file" accept="image/*" onChange={(e) => readImage(e.target.files[0], (image) => setEditingClothing((prev) => ({ ...prev, image })))} />
                          </div>
                        </div>
                        {editingClothing.image && <img className="image-preview" src={editingClothing.image} alt="รูปตัวอย่าง" />}
                        <div style={{ display: "flex", gap: 8, marginTop: 13 }}>
                          <button className="button primary" onClick={saveClothing}><Save size={15} /> บันทึก</button>
                          <button className="button outline" onClick={() => setEditingClothing(null)}>ยกเลิก</button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {adminTab === "products" && (
                  <>
                    <h2>จัดการผลิตภัณฑ์ซักรีด</h2>
                    <div className="section-note" style={{ marginBottom: 16 }}>
                      บันทึกผลิตภัณฑ์ที่ร้านใช้ เช่น น้ำยาซักผ้า น้ำยาปรับผ้านุ่ม และผลิตภัณฑ์ขจัดคราบ
                    </div>
                    <form onSubmit={addProduct}>
                      <div className="form-grid">
                        <div className="field"><label>ชื่อผลิตภัณฑ์</label><input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="ชื่อผลิตภัณฑ์" /></div>
                        <div className="field"><label>ยี่ห้อ</label><input value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} placeholder="ยี่ห้อ" /></div>
                        <div className="field">
                          <label>ประเภทผลิตภัณฑ์</label>
                          <select value={newProduct.type} onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}>
                            <option>น้ำยาซักผ้า</option><option>น้ำยาปรับผ้านุ่ม</option><option>ขจัดคราบ</option><option>ผลิตภัณฑ์อื่น ๆ</option>
                          </select>
                        </div>
                        <div className="field"><label>กลิ่น / สูตร</label><input value={newProduct.scent} onChange={(e) => setNewProduct({ ...newProduct, scent: e.target.value })} /></div>
                        <div className="field"><label>ราคา (บาท)</label><input type="number" min="0" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} /></div>
                        <div className="field"><label>รายละเอียด</label><input value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} /></div>
                      </div>
                      <button className="button primary" type="submit"><Plus size={15} /> เพิ่มผลิตภัณฑ์</button>
                    </form>
                    <hr className="divider" />
                    <h3>รายการผลิตภัณฑ์</h3>
                    {products.map((item) => (
                      <div className="customer-row" key={item.id}>
                        <div>
                          <strong>{item.name}</strong>
                          <div className="muted">{item.brand} · {item.type} · {item.scent}</div>
                          <div className="muted">{money(item.price)} บาท</div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="button secondary small-button" onClick={() => setEditingProduct({ ...item })}><Edit size={13} /> แก้ไข</button>
                          <button className="button danger small-button" onClick={() => deleteProduct(item.id)}><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}
                    {editingProduct && (
                      <div className="card" style={{ marginTop: 18, background: "#f8fbff" }}>
                        <h3>แก้ไขผลิตภัณฑ์</h3>
                        <div className="form-grid">
                          <div className="field"><label>ชื่อผลิตภัณฑ์</label><input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} /></div>
                          <div className="field"><label>ยี่ห้อ</label><input value={editingProduct.brand} onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })} /></div>
                          <div className="field">
                            <label>ประเภท</label>
                            <select value={editingProduct.type} onChange={(e) => setEditingProduct({ ...editingProduct, type: e.target.value })}>
                              <option>น้ำยาซักผ้า</option><option>น้ำยาปรับผ้านุ่ม</option><option>ขจัดคราบ</option><option>ผลิตภัณฑ์อื่น ๆ</option>
                            </select>
                          </div>
                          <div className="field"><label>กลิ่น / สูตร</label><input value={editingProduct.scent} onChange={(e) => setEditingProduct({ ...editingProduct, scent: e.target.value })} /></div>
                          <div className="field"><label>ราคา</label><input type="number" min="0" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} /></div>
                          <div className="field"><label>รายละเอียด</label><input value={editingProduct.description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} /></div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="button primary" onClick={saveProduct}><Save size={15} /> บันทึก</button>
                          <button className="button outline" onClick={() => setEditingProduct(null)}>ยกเลิก</button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {adminTab === "shop" && (
                  <>
                    <h2>จัดการสถานะการเปิดให้บริการ</h2>
                    <div className={`shop-status ${shopOpen ? "open" : "closed"}`}>
                      <div className="status-main">
                        <Store size={28} />
                        <div>
                          <h3>{shopOpen ? "ร้านเปิดให้บริการ" : "ร้านปิดให้บริการชั่วคราว"}</h3>
                          <p>{shopMessage}</p>
                        </div>
                      </div>
                      <span className={`status-pill ${shopOpen ? "green" : "red"}`}>{shopOpen ? "เปิด" : "ปิด"}</span>
                    </div>
                    <div className="field">
                      <label>สถานะร้าน</label>
                      <div className="choice-grid">
                        <button type="button" className={`choice ${shopOpen ? "selected" : ""}`} onClick={() => setShopOpen(true)}>
                          <Check size={23} color="#24965c" /><div><h3>เปิดให้บริการ</h3><p>เปิดรับผ้าและรับจองคิวตามปกติ</p></div>
                        </button>
                        <button type="button" className={`choice ${!shopOpen ? "selected" : ""}`} onClick={() => setShopOpen(false)}>
                          <X size={23} color="#c6534d" /><div><h3>ปิดให้บริการชั่วคราว</h3><p>งดรับผ้าและปิดการจองคิวชั่วคราว</p></div>
                        </button>
                      </div>
                    </div>
                    <div className="field">
                      <label>เหตุผลที่ปิดร้าน</label>
                      <select value={shopReason} onChange={(e) => setShopReason(e.target.value)}>
                        <option>เจ้าของร้านไม่สบาย</option>
                        <option>เจ้าของร้านมีธุระส่วนตัว</option>
                        <option>หยุดพักผ่อน</option>
                        <option>ร้านหยุดปรับปรุง</option>
                        <option>เหตุขัดข้องภายในร้าน</option>
                        <option>อื่น ๆ</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>ข้อความประกาศให้ลูกค้าทราบ</label>
                      <textarea value={shopMessage} onChange={(e) => setShopMessage(e.target.value)} placeholder="เขียนข้อความแจ้งลูกค้า" />
                    </div>
                    <button className="button primary" onClick={() => showNotice("อัปเดตสถานะร้านแล้ว")}><Save size={16} /> บันทึกสถานะร้าน</button>
                    <div className="section-note" style={{ marginTop: 15 }}>
                      เมื่อเปลี่ยนสถานะร้าน ลูกค้าจะเห็นข้อมูลบนหน้าแรกทันที และเมื่อร้านปิด ระบบจะไม่อนุญาตให้ส่งรายการจองใหม่
                    </div>
                  </>
                )}
              </section>
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <strong>DEMO Laundry</strong>
          <p>ตัวอย่างเว็บไซต์ระบบจัดการร้านซักอบรีด</p>
          <span>DEMO VERSION · ข้อมูลตัวอย่างสำหรับการนำเสนอ</span>
          <div style={{ marginTop: 12 }}>
            <button className="button secondary small-button" onClick={() => goTo("guide")}>
              <BookOpen size={14} /> เปิดคู่มือการใช้งาน
            </button>
          </div>
        </div>
      </footer>

      {notice && <div className="notice">{notice}</div>}
    </div>
  );
}

export default App;
