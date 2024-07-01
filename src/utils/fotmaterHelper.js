class FormaterHelper {

    static stripRupiahFormatting(value) {
        let original_value = this.hasSpecialChars(value)
        console.log(original_value)

        if(original_value) {
            return value.replace(/[^0-9]/g, '');
        }
    }

    static formatRupiah(value) {
        const numberString = value.replace(/[^,\d]/g, '').toString();
        const split = numberString.split(',');
        const sisa = split[0].length % 3;
        let rupiah = split[0].substr(0, sisa);
        const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (ribuan) {
            const separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
        // return 'RP ' + rupiah;
        return rupiah;
    }

    // Method to check if a value contains special characters
    static hasSpecialChars(value) {
        const specialCharRegex = /[^a-zA-Z0-9]/;
        return specialCharRegex.test(value);
    }
}

export default FormaterHelper;
