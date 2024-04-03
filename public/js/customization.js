document.addEventListener("DOMContentLoaded", function () {
    const upgradeLinks = document.querySelectorAll(".upgrade-link");
    const customizationTotal = document.getElementById("customization-total");
    const resetButton = document.getElementById("reset-button");
    const basePrice = parseFloat(document.getElementById("total").textContent);

    let customizationPrice = basePrice;
    const upgradeCounts = {}; // Object to store upgrade counts

    upgradeLinks.forEach(function (upgradeLink) {
        upgradeLink.addEventListener("click", function (event) {
            event.preventDefault();
            const upgradeType = upgradeLink.dataset.upgrade;
            const upgradePrice = calculateUpgradePrice(upgradeType);
            customizationPrice += upgradePrice;
            updateCustomizationTotal(customizationPrice);
            updateUpgradeCount(upgradeType);
        });
    });

    resetButton.addEventListener("click", function () {
        customizationPrice = basePrice;
        updateCustomizationTotal(customizationPrice);
        resetUpgradeCount();
    });

    function calculateUpgradePrice(upgradeType) {
        switch (upgradeType) {
            case "flux-capacitor":
                return basePrice * 0.1; // 10% of base price
            case "flame-decals":
                return basePrice * 0.06; // 6% of base price
            case "bumper-stickers":
                return basePrice * 0.04; // 4% of base price
            case "hub-caps":
                return basePrice * 0.15; // 15% of base price
            default:
                return 0;
        }
    }

    function updateCustomizationTotal(total) {
        const newTotal = new Intl.NumberFormat('en-US').format(total);
        customizationTotal.textContent = "Estimated Customization Total: $" + newTotal;
    }

    function updateUpgradeCount(upgradeType) {
        if (upgradeCounts[upgradeType]) {
            upgradeCounts[upgradeType]++;
        } else {
            upgradeCounts[upgradeType] = 1;
        }
        displayUpgradeCounts();
    }

    function resetUpgradeCount() {
        for (const upgradeType in upgradeCounts) {
            upgradeCounts[upgradeType] = 0;
        }
        displayUpgradeCounts();
    }

    function displayUpgradeCounts() {
        const countsContainer = document.getElementById("upgrade-counts");
        countsContainer.innerHTML = ""; // Clear previous counts
        for (const upgradeType in upgradeCounts) {
            const count = upgradeCounts[upgradeType];
            const upgradeCountElement = document.createElement("p");
            upgradeCountElement.textContent = `${upgradeType}: ${count}`;
            countsContainer.appendChild(upgradeCountElement);
        }
    }
});
