export function home() {
    let catArr = ['Electronics', 'TVs & Appliances', 'Men', 'Women', 'Baby & Kids', 'Home & Furniture', 'Sports, Books & More'];

    let subCatObj = {
        'elecArr': ['Mobiles', 'Mobile Accessories', 'Smart Wearable Tech', 'Health Care Appliances', 'Laptops', 'Desktop PCs', 'Gaming Accessories', 'Computer Accessories', 'Computer Peripherals', 'Tablets', 'Speakers', 'Smart Home Automation', 'Camera', 'Camera Accessories', 'Network Components'],

        'tvsAppArr': ['Television', 'Washing Machine', 'Air Conditioners', 'Refrigerators', 'Kitchen Appliances', 'Healthy Living Appliances', 'Small Home Appliances'],

        'menArr': ['Footwear', 'Mens Grooming', 'Top Wear', 'Bottom Wear', 'Suits, Blazers & Waistcoats', 'Ties, Socks, Cops & More', 'Fabrics', 'Winter Wear', 'Ethnic Wear', 'Innerwear & Loungewear', 'Raincoats & Windcheaters', 'Watches', 'Sports & Fitness Store', 'Smart Watches', 'Personal Care Appliances'],

        'womanArr': ['Ethnic wear', 'Ethnic bottoms', 'footware', 'sandals', 'shoes', 'bllerians', 'slippers & Flip -flops', 'watches', 'smart watches', 'personal care Applications', 'eauty & Grooming', 'jewllery'],

        'babyArr': ['kids clothings', 'boys clothing', 'girls clothing', 'baby boys clothing', 'kinds footware', 'boys footware', 'girls footware', 'infant footware', 'kids footware', 'character shoes', 'kids winter wear', 'boys winter wear', 'girls winter wear', 'toys', 'schools supplies', 'baby care'],

        'homeArr': ['kitchen,cookware& serveware', 'Tableware &Dinner', 'kitchen storage', 'Furniture Top Offers', 'bed Room Furniture', 'Living Room Furmiture', 'Office & Study Furniture', 'DIY Furniture', 'Furnishing', 'Smart Home Automation', 'Home Improvement', 'home Decor ', 'Honme LIghting', 'Festival Decor& Gifts', 'pet Supplies', 'Durability Certified Furniture', 'Chrismas Store', 'Gardening Store'],

        'sportArr': ['Food Essentials', 'Health & Nutrition', 'books', 'Stationery', 'Auto Accessories', 'industriall & Scientific tools', 'Medical Supplies', 'Music', 'Gaming', 'Grocery']
    }

    function addSubCategory(subCatKey, category) {
        let ul = document.createElement("ul");
        ul.setAttribute('id', 'cat-dropdown');


        let subCatObjKeyArr = eval(`subCatObj.${subCatKey}`);
        // console.log(subCatObjKeyArr);
        subCatObjKeyArr.map(subCat => {
            let li = document.createElement("li");
            li.setAttribute('class', 'cat-dropdown-li');
            li.style.display = 'grid';
            li.style.justifyContent = 'center';

            let a = document.createElement("a");

            a.innerHTML = subCat
            a.setAttribute('href', `/category/${category}/${subCat}`);
            li.appendChild(a);
            ul.appendChild(li);
        })
        return ul;
    }

    function addCategory(category, catNavUl, subCatKey) {
        let li = document.createElement("li");
        let a = document.createElement("a");


        li.setAttribute('id', 'cat-nav-li');
        a.setAttribute('href', `/category/${category}`);
        a.innerHTML = category;
        li.appendChild(a);
        li.appendChild(addSubCategory(subCatKey, category));
        if (catNavUl) {
            catNavUl.appendChild(li);
        }
    }

    let catNavUl = document.querySelector('#cat-nav-ul');
    let subCatArr = Object.keys(subCatObj); //using this you can get array of all key in subCatObj => ["elecArr", "tvsAppArr", "menArr", "womanArr", "babyArr", "homeArr", "sportArr"]

    catArr.map((category, index) => {
        let subCatKey = subCatArr[index];
        addCategory(category, catNavUl, subCatKey);
    })
}