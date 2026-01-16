var app = angular.module("discountApp", []);

app.controller("DiscountController", function ($scope) {

    $scope.mode = "home";
    $scope.items = JSON.parse(localStorage.getItem("items")) || [];
    $scope.alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    $scope.totalBill = 0;

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
            i.billPrice = i.finalPrice || i.mrp;
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
            size: "",          // ✅ ADDED
            mrp: "",
            discount: "",
            finalPrice: 0,
            selected: false
        };
        $scope.items.push(item);
        save();

        setTimeout(() => {
            const inputs = document.querySelectorAll("tbody tr:last-child input");
            if (inputs[1]) inputs[1].focus();
        }, 50);
    };

    $scope.removeRow = (i) => {
        $scope.items.splice(i, 1);
        save();
    };

    $scope.updatePrice = (item) => {
        if (item.mrp !== "" && item.discount !== "") {
            item.finalPrice = item.mrp - (item.mrp * item.discount / 100);
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
});
