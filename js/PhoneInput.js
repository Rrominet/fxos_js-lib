class PhoneInput {
    // [country name, calling code, strip national trunk 0, spacing groups, national syntax]
    static COUNTRIES = {
        FR: ["France",         "33",  true,  [1, 2, 2, 2, 2], /^[1-9]\d{8}$/],
        TW: ["Taiwan",         "886", true,  [3, 3, 3],       /^(?:9\d{8}|[2-8]\d{7,8})$/],
        US: ["United States",  "1",   false, [3, 3, 4],       /^[2-9]\d{2}[2-9]\d{6}$/],
        CA: ["Canada",         "1",   false, [3, 3, 4],       /^[2-9]\d{2}[2-9]\d{6}$/],
        GB: ["United Kingdom", "44",  true,  [4, 6],          /^[1-9]\d{8,9}$/],
        DE: ["Germany",        "49",  true,  [3, 3, 4],       /^[1-9]\d{5,13}$/],
        ES: ["Spain",          "34",  false, [3, 3, 3],       /^[6-9]\d{8}$/],
        IT: ["Italy",          "39",  false, [3, 3, 4],       /^\d{6,12}$/], // Italian area-code 0 is significant
        PT: ["Portugal",       "351", false, [3, 3, 3],       /^[29]\d{8}$/],
        BE: ["Belgium",        "32",  true,  [3, 2, 2, 2],    /^[1-9]\d{7,8}$/],
        CH: ["Switzerland",    "41",  true,  [2, 3, 2, 2],    /^[1-9]\d{8}$/],
        NL: ["Netherlands",    "31",  true,  [1, 4, 4],       /^[1-9]\d{8}$/],
        AT: ["Austria",        "43",  true,  [3, 3, 4],       /^[1-9]\d{6,12}$/],
        SE: ["Sweden",         "46",  true,  [2, 3, 2, 2],    /^[1-9]\d{6,9}$/],
        NO: ["Norway",         "47",  false, [3, 2, 3],       /^[2-9]\d{7}$/],
        DK: ["Denmark",        "45",  false, [2, 2, 2, 2],    /^[2-9]\d{7}$/],
        FI: ["Finland",        "358", true,  [2, 3, 4],       /^[1-9]\d{4,11}$/],
        PL: ["Poland",         "48",  false, [3, 3, 3],       /^[1-9]\d{8}$/],
        CZ: ["Czechia",        "420", false, [3, 3, 3],       /^[1-9]\d{8}$/],
        IE: ["Ireland",        "353", true,  [2, 3, 4],       /^[1-9]\d{6,9}$/],
        AU: ["Australia",      "61",  true,  [3, 3, 3],       /^[2-478]\d{8}$/],
        NZ: ["New Zealand",    "64",  true,  [2, 3, 4],       /^[1-9]\d{6,10}$/],
        JP: ["Japan",          "81",  true,  [2, 4, 4],       /^[1-9]\d{8,9}$/],
        KR: ["South Korea",    "82",  true,  [2, 4, 4],       /^[1-9]\d{7,9}$/],
        CN: ["China",          "86",  true,  [3, 4, 4],       /^[1-9]\d{9,11}$/],
        HK: ["Hong Kong",      "852", false, [4, 4],          /^[2-9]\d{7}$/],
        SG: ["Singapore",      "65",  false, [4, 4],          /^[3689]\d{7}$/],
        IN: ["India",          "91",  true,  [5, 5],          /^[1-9]\d{9}$/],
        ID: ["Indonesia",      "62",  true,  [3, 4, 4],       /^[1-9]\d{7,11}$/],
        MY: ["Malaysia",       "60",  true,  [2, 3, 4],       /^[1-9]\d{7,9}$/],
        TH: ["Thailand",       "66",  true,  [2, 3, 4],       /^[1-9]\d{7,8}$/],
        VN: ["Vietnam",        "84",  true,  [3, 3, 3],       /^[1-9]\d{8,9}$/],
        PH: ["Philippines",    "63",  true,  [3, 3, 4],       /^[1-9]\d{8,9}$/],
        BR: ["Brazil",         "55",  true,  [2, 5, 4],       /^[1-9]\d{9,10}$/],
        MX: ["Mexico",         "52",  false, [2, 4, 4],       /^[1-9]\d{9}$/],
        AR: ["Argentina",      "54",  true,  [2, 4, 4],       /^[1-9]\d{9,10}$/],
        ZA: ["South Africa",   "27",  true,  [2, 3, 4],       /^[1-9]\d{8}$/],
        AE: ["UAE",            "971", true,  [2, 3, 4],       /^[1-9]\d{7,8}$/],
        SA: ["Saudi Arabia",   "966", true,  [2, 3, 4],       /^[1-9]\d{8}$/],
        IL: ["Israel",         "972", true,  [2, 3, 4],       /^[1-9]\d{7,8}$/],
        TR: ["Turkey",         "90",  true,  [3, 3, 4],       /^[1-9]\d{9}$/],
        RU: ["Russia",         "7",   true,  [3, 3, 2, 2],    /^[1-9]\d{9}$/],
        KZ: ["Kazakhstan",     "7",   true,  [3, 3, 2, 2],    /^[1-9]\d{9}$/]
    };

    constructor(parent, {country = "FR", name = "phone", required = false,
                         placeholder = "", value = "", countries = null} = {}) {
        this.codes = countries || Object.keys(PhoneInput.COUNTRIES);
        if (!this.codes.includes(country) || !PhoneInput.COUNTRIES[country])
            throw new Error(`Unsupported country: ${country}`);

        this.element = parent.newNode("div", "phone-input");
        this.select = this.element.newSelect();
        this.select.className = "phone-input-country";
        this.select.setAttribute("aria-label", "Country calling code");

        for (const iso of [...this.codes].sort((a, b) =>
            PhoneInput.COUNTRIES[a][0].localeCompare(PhoneInput.COUNTRIES[b][0]))) {
            const data = PhoneInput.COUNTRIES[iso];
            const opt = this.select.newNode("option");
            opt.value = iso;
            opt.textContent = `${iso} +${data[1]}`;
            opt.title = data[0];
        }
        this.select.value = country;

        // Visible national number; hidden input sends international E.164 on forms.
        this.input = this.element.newInput("tel");
        this.input.className = "phone-input-number";
        this.input.inputMode = "tel";
        this.input.autocomplete = "tel-national";
        this.input.required = required;
        this.input.setAttribute("aria-label", "Phone number without country code");
        this.input.placeholder = placeholder;
        this.input.maxLength = 30;

        this.status = this.element.newNode("span", "phone-input-status");
        this.status.setAttribute("aria-hidden", "true");
        this.hidden = this.element.newInput("hidden", name);

        this.input.addEventListener("input", () => this._onInput());
        this.select.addEventListener("change", () => {
            this._update(Infinity);
            this._emit();
        });
        this.input.addEventListener("keydown", e => this._onKeyDown(e));

        this.setValue(value);
    }

    _data() { return PhoneInput.COUNTRIES[this.select.value]; }
    _digits(value) { return String(value).replace(/\D/g, ""); }

    _groups(digits) {
        const iso = this.select.value;
        const fallback = this._data()[3];
        if (iso === "GB") return digits.startsWith("7") ? [4, 6] :
                                    digits.startsWith("20") ? [2, 4, 4] : [3, 3, 4];
        if (iso === "TW") return digits.startsWith("9") ? [3, 3, 3] : [1, 4, 4];
        if (iso === "JP") return /^(70|80|90)/.test(digits) ? [2, 4, 4] : [1, 4, 4];
        if (iso === "AU") return digits.startsWith("4") ? [3, 3, 3] : [1, 4, 4];
        if (iso === "BR") return digits.length === 10 ? [2, 4, 4] : [2, 5, 4];
        if (iso === "CN") return digits.length === 10 ? [2, 4, 4] : fallback;
        return fallback;
    }

    _format(digits) {
        const parts = [];
        let index = 0;
        for (const size of this._groups(digits)) {
            if (index >= digits.length) break;
            parts.push(digits.slice(index, index + size));
            index += size;
        }
        if (index < digits.length) parts.push(digits.slice(index));
        return parts.join(" ");
    }

    _onKeyDown(event) {
        // When backspacing at a space, delete the previous DIGIT instead.
        if (this.input.selectionStart !== this.input.selectionEnd) return;
        const pos = this.input.selectionStart;
        if (event.key === "Backspace" && this.input.value[pos - 1] === " ") {
            event.preventDefault();
            this.input.setRangeText("", pos - 2, pos, "start");
            this._onInput();
        } else if (event.key === "Delete" && this.input.value[pos] === " ") {
            event.preventDefault();
            this.input.setRangeText("", pos, pos + 2, "start");
            this._onInput();
        }
    }

    _onInput() {
        let cursor = this._digits(this.input.value.slice(0, this.input.selectionStart)).length;
        if (this.input.value.trim().startsWith("+")) {
            const found = this._parseInternational(this.input.value);
            if (found) {
                this.select.value = found.iso;
                this.input.value = found.national;
                cursor = Infinity; // Pasting a complete E.164 number
            }
        }
        this._update(cursor);
        this._emit();
    }

    _parseInternational(value) {
        const digits = this._digits(value);
        const matches = this.codes.filter(iso =>
            digits.startsWith(PhoneInput.COUNTRIES[iso][1]));
        if (!matches.length) return null;
        matches.sort((a, b) => PhoneInput.COUNTRIES[b][1].length -
                               PhoneInput.COUNTRIES[a][1].length);
        // +1 and +7 belong to several countries. Keep the existing selection if possible.
        const current = matches.find(iso => iso === this.select.value &&
            PhoneInput.COUNTRIES[iso][1] === PhoneInput.COUNTRIES[matches[0]][1]);
        const iso = current || matches[0];
        return {iso, national: digits.slice(PhoneInput.COUNTRIES[iso][1].length)};
    }

    _update(cursor = Infinity) {
        const data = this._data();
        let digits = this._digits(this.input.value);
        if (data[2] && digits.startsWith("0") && digits.length > 1) {
            digits = digits.slice(1); // e.g. FR 06... -> +33 6...
            if (Number.isFinite(cursor) && cursor > 0) cursor--;
        }
        this.input.value = this._format(digits);

        // Put caret after the same nth digit, even when a space was inserted.
        let position = this.input.value.length;
        if (cursor === 0) position = 0;
        else if (Number.isFinite(cursor)) {
            for (let i = 0, seen = 0; i < this.input.value.length; i++) {
                if (/\d/.test(this.input.value[i])) seen++;
                if (seen >= cursor) { position = i + 1; break; }
            }
        }
        this.input.setSelectionRange(position, position);

        const valid = this.isValid();
        this.element.classList.toggle("ok", valid);
        this.element.classList.toggle("invalid", digits.length > 0 && !valid);
        this.status.textContent = digits.length ? (valid ? "✓" : "×") : "";
        this.input.setCustomValidity(digits.length && !valid ? "Invalid phone number for " + data[0] : "");
        this.input.setAttribute("aria-invalid", digits.length > 0 && !valid ? "true" : "false");
        this.hidden.value = this.getValue() || "";
    }

    _emit() {
        this.element.dispatchEvent(new CustomEvent("phonechange", {
            bubbles: true,
            detail: {value: this.getValue(), valid: this.isValid(), country: this.select.value}
        }));
    }

    isValid() {
        const digits = this._digits(this.input.value);
        return this._data()[4].test(digits) && (this._data()[1].length + digits.length <= 15);
    }

    // E.164 string or null if invalid. Example: "+886912345678".
    getValue() {
        return this.isValid() ? "+" + this._data()[1] + this._digits(this.input.value) : null;
    }

    setCountry(iso) {
        if (!this.codes.includes(iso) || !PhoneInput.COUNTRIES[iso])
            throw new Error(`Unsupported country: ${iso}`);
        this.select.value = iso;
        this._update();
        this._emit();
        return this;
    }

    setValue(value) {
        const string = String(value ?? "").trim();
        const found = string.startsWith("+") ? this._parseInternational(string) : null;
        if (found) this.select.value = found.iso;
        this.input.value = found ? found.national : string;
        this._update();
        this._emit();
        return this;
    }

    //use type == "phonechange"
    addEventListener(type, callback) {
        this.element.addEventListener(type, e => callback(e));
        return this;
    }

    remove() { this.element.remove(); }
}

HTMLElement.prototype.newPhoneInput = function(options = {}) {
    return new PhoneInput(this, options);
};
