const Language = function() {
    const lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'id'
    let LABEL_LANG;
    let UNAUTHORIZED;

    let LABEL_NUMBER;
    let LABEL_NAME;
    let LABEL_DATE;
    let LABEL_PHONE;
    let LABEL_ADDRESS;
    let LABEL_INITIAL;
    let LABEL_DESC;
    let LABEL_ACTION;
    let LABEL_IMAGE;
    let LABEL_TYPE;
    let LABEL_STOCK;
    let LABEL_QTY;
    let LABEL_PURCHASE_PRICE;
    let LABEL_SELLING_PRICE;
    
    let LABEL_UNIT;
    let LABEL_BRAND;
    let LABEL_CATEGORY;
    let LABEL_PRODUCT;
    let LABEL_BRANCH;
    let LABEL_WAREHOUSE;
    let LABEL_ADJUSTSTOCK;

    let LABEL_ADD;
    let LABEL_EDIT;
    let LABEL_DELETE;
    let LABEL_SAVE;
    let LABEL_CANCEL;

    let MENU_NAME_UNIT;
    let MENU_NAME_BRAND;
    let MENU_NAME_CATEGORY;
    let MENU_NAME_PRODUCT;
    let MENU_NAME_BRANCH;
    let MENU_NAME_WAREHOUSE;
    let MENU_NAME_ADJUSTMENTSTOCK;
    let MENU_NAME_TRANSFERWAREHOUSE;

    let MENU_NAME_VENDOR;

    if (lang === 'id') {
        LABEL_LANG = 'Bahasa';
        UNAUTHORIZED = 'Anda belum login, silahkan login terlebuh dahulu.';
        
        LABEL_NUMBER = 'Nomor';
        LABEL_NAME = 'Nama';
        LABEL_DATE = 'Tanggal';
        LABEL_PHONE = 'Telp';
        LABEL_ADDRESS = 'Alamat';
        LABEL_INITIAL = 'Inisial';
        LABEL_DESC = 'Deskripsi';
        LABEL_ACTION = 'Aksi';
        LABEL_IMAGE = 'Gambar';
        LABEL_TYPE = 'Tipe';
        LABEL_STOCK = 'Stok';
        LABEL_QTY = 'Qty';
        LABEL_PURCHASE_PRICE = 'Harga Beli';
        LABEL_SELLING_PRICE = 'Harga Jual';

        LABEL_ADD = 'Tambah Data';
        LABEL_EDIT = 'Ubah Data';
        LABEL_DELETE = 'Hapus Data';
        LABEL_SAVE = 'Simpan';
        LABEL_CANCEL = 'Batal';
        LABEL_UNIT = "Satuan";
        LABEL_BRAND = "Merek";
        LABEL_CATEGORY = "Kategori";
        LABEL_PRODUCT = "Produk";
        LABEL_BRANCH = "Cabang";
        LABEL_WAREHOUSE = "Gudang";
        LABEL_ADJUSTSTOCK = "Penyesuaian Stock";

        MENU_NAME_UNIT = 'Master Satuan';
        MENU_NAME_BRAND = 'Master Merek';
        MENU_NAME_CATEGORY = 'Kategori Produk';
        MENU_NAME_PRODUCT = 'Master Produk';
        MENU_NAME_BRANCH = 'Master Cabang';
        MENU_NAME_WAREHOUSE = 'Master Gudang';
        MENU_NAME_ADJUSTMENTSTOCK = 'Penyesuaian Stok';
        MENU_NAME_TRANSFERWAREHOUSE = 'Perpindahan Gudang';

        MENU_NAME_VENDOR = 'Vendor';
    } else if (lang === 'en') {
        LABEL_LANG = 'Language';
        UNAUTHORIZED = "Your'r not logged in, please login.";

        LABEL_NUMBER = 'Number';
        LABEL_NAME = 'Name';
        LABEL_DATE = 'Date';
        LABEL_PHONE = 'Phone';
        LABEL_ADDRESS = 'Address';
        LABEL_INITIAL = 'Initial';
        LABEL_DESC = 'Description';
        LABEL_ACTION = 'Action';
        LABEL_IMAGE = 'Image';
        LABEL_TYPE = 'Type';
        LABEL_STOCK = 'Stock';
        LABEL_QTY = 'Qty';
        LABEL_PURCHASE_PRICE = 'Purchase Price';
        LABEL_SELLING_PRICE = 'Selling Price';

        LABEL_ADD = 'Add Data';
        LABEL_EDIT = 'Edit Data';
        LABEL_DELETE = 'Delete Data';
        LABEL_SAVE = 'Save';
        LABEL_CANCEL = 'Cancel';
        LABEL_UNIT = "Units";
        LABEL_BRAND = "Brands";
        LABEL_CATEGORY = "Categories";
        LABEL_PRODUCT = "Product";
        LABEL_BRANCH = "Branches";
        LABEL_WAREHOUSE = "Warehouses";
        LABEL_ADJUSTSTOCK = "Stock Adjustment";

        MENU_NAME_UNIT = 'Master Unit';
        MENU_NAME_BRAND = 'Master Brand';
        MENU_NAME_CATEGORY = 'Master Category';
        MENU_NAME_PRODUCT = 'Master Product';
        MENU_NAME_BRANCH = 'Master Branch';
        MENU_NAME_WAREHOUSE = 'Master Warehouse';
        MENU_NAME_ADJUSTMENTSTOCK = 'Stock Adjustment';
        MENU_NAME_TRANSFERWAREHOUSE = 'Warehouse Transfer';

        MENU_NAME_VENDOR = 'Vendors';
    }

    return {
        lang,
        LABEL_LANG,
        UNAUTHORIZED,

        LABEL_NUMBER,
        LABEL_NAME,
        LABEL_DATE,
        LABEL_PHONE,
        LABEL_ADDRESS,
        LABEL_INITIAL,
        LABEL_DESC,
        LABEL_ACTION,
        LABEL_IMAGE,
        LABEL_TYPE,
        LABEL_STOCK,
        LABEL_QTY,
        LABEL_PURCHASE_PRICE,
        LABEL_SELLING_PRICE,

        LABEL_ADD,
        LABEL_EDIT,
        LABEL_DELETE,
        LABEL_SAVE,
        LABEL_CANCEL,
        LABEL_UNIT,
        LABEL_BRAND,
        LABEL_CATEGORY,
        LABEL_PRODUCT,
        LABEL_BRANCH,
        LABEL_WAREHOUSE,
        LABEL_ADJUSTSTOCK,

        MENU_NAME_UNIT,
        MENU_NAME_BRAND,
        MENU_NAME_CATEGORY,
        MENU_NAME_PRODUCT,
        MENU_NAME_BRANCH,
        MENU_NAME_WAREHOUSE,
        MENU_NAME_ADJUSTMENTSTOCK,
        MENU_NAME_TRANSFERWAREHOUSE,

        MENU_NAME_VENDOR,
    };
};

export default Language;
