var app = angular.module("discountApp", []);

app.controller("DiscountController", function ($scope) {

    $scope.mode = "home";
    $scope.items = JSON.parse(localStorage.getItem("items")) || [];
    $scope.alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    $scope.totalBill = 0;
    $scope.finalBillItems = [];
    $scope.billDate = "";

    function save() {
        localStorage.setItem("items", JSON.stringify($scope.items));
    }

    /* STARTS-WITH SEARCH FILTER */
    $scope.startsWith = function (text) {
        return function (item) {
            if (!text) return true;
            if (!item.name) return false;
            return item.name.toLowerCase().startsWith(text.toLowerCase());
        };
    };

    /* NAVIGATION */
    $scope.openDiscount = () => $scope.mode = "discount";

    $scope.openBill = () => {
        $scope.items.forEach(i => {
            i.billSelected = false;
            i.billPrice = (i.finalPrice > 0) ? i.finalPrice : i.mrp;
            i.quantity = 1;
        });
        $scope.totalBill = 0;
        $scope.mode = "bill";
    };

    $scope.goBack = () => $scope.mode = "home";

    /* DISCOUNT */
    $scope.addRow = () => {
        const item = {
            name: "",
            size: "",
            mrp: "",
            discount: "",
            finalPrice: 0,
            selected: false
        };
        $scope.items.push(item);
        save();
    };

    $scope.removeRow = (i) => {
        $scope.items.splice(i, 1);
        save();
    };

    $scope.updatePrice = (item) => {
        const d = (item.discount === "" || item.discount == null) ? 0 : item.discount;
        if (item.mrp !== "") {
            item.finalPrice = item.mrp - (item.mrp * d / 100);
            save();
        }
    };

    $scope.applyToAll = () => {
        $scope.items.forEach(i => {
            i.discount = $scope.globalDiscount || 0;
            $scope.updatePrice(i);
        });
    };

    $scope.applyToSelected = () => {
        $scope.items.forEach(i => {
            if (i.selected) {
                i.discount = $scope.globalDiscount || 0;
                $scope.updatePrice(i);
            }
        });
    };

    /* BILL */
    $scope.calculateBill = () => {
        $scope.totalBill = 0;
        $scope.items.forEach(i => {
            if (i.billSelected) {
                $scope.totalBill += (i.billPrice || 0) * (i.quantity || 1);
            }
        });
    };

    /* FINISH BILL */
    $scope.finishBill = () => {
        $scope.finalBillItems = [];
        $scope.totalBill = 0;

        $scope.items.forEach(i => {
            if (i.billSelected) {
                const lineTotal = (i.billPrice || 0) * (i.quantity || 1);
                $scope.totalBill += lineTotal;

                $scope.finalBillItems.push({
                    name: i.name,
                    size: i.size,
                    billPrice: i.billPrice,
                    quantity: i.quantity
                });
            }
        });

        const d = new Date();
        $scope.billDate =
            String(d.getDate()).padStart(2, "0") + "/" +
            String(d.getMonth() + 1).padStart(2, "0") + "/" +
            d.getFullYear();

        $scope.mode = "billSummary";
    };

    /* BACK FROM FINAL BILL */
    $scope.backToBill = () => {
        $scope.items.forEach(i => {
            i.billSelected = false;
            i.quantity = 1;
        });
        $scope.totalBill = 0;
        $scope.mode = "bill";
    };

    /* PRINT */
    $scope.printBill = () => {
        window.print();
    };
});
