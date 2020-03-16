export function getDisplayName(preEulaRank, postEulaRank, plusColour, name, plusplusColour, staffRank, monthlyPackageRank) {

    function getRank() {

        function getPackageRank() {

            function getColour(colour) {
                switch (colour) {
                    case "BLACK":
                        return "§0";
                    case "DARK_BLUE":
                        return "§1";
                    case "DARK_GREEN":
                        return "§2";
                    case "DARK_AQUA":
                        return "§3";
                    case "DARK_RED":
                        return "§4";
                    case "DARK_PURPLE":
                        return "§5";
                    case "GOLD":
                        return "§6";
                    case "GREY":
                        return "§7";
                    case "DARK_GREY":
                        return "§8";
                    case "BLUE":
                        return "§9";
                    case "GREEN":
                        return "§a";
                    case "AQUA":
                        return "§b";
                    case "red":
                        return "§c";
                    case "LIGHT_PURPLE":
                        return "§d";
                    case "YELLOW":
                        return "§e";
                    case "WHITE":
                        return "§f";
                    default:
                        return "§b";
                }
            }

            let packageRank = (preEulaRank == null) ? postEulaRank : preEulaRank;
            switch (packageRank) {
                case "VIP":
                    return "§a[VIP] ";
                case "VIP_PLUS":
                    return "§a[VIP§6+§a] ";
                case "MVP":
                    return "§b[MVP] ";
                case "MVP_PLUS":
                    return getColour(plusplusColour) +
                        "[MVP" + getColour(plusColour) +
                        ((monthlyPackageRank == null || monthlyPackageRank === "NONE") ? "+" : "++") +
                        getColour(plusplusColour) + "] ";
                default:
                    return "§7";
            }

        }

        function getSpecialRank() {
            switch (staffRank) {
                case "HELPER":
                    return "§9[HELPER] ";
                case "MODERATOR":
                    return "§2[MODERATOR] ";
                case "ADMIN":
                    return "§c[ADMIN ";
                case "YOUTUBER":
                    return "$f[$cYOUTUBE$f]$c ";
                default:
                    return "[Special] ";
            }

        }

        return (staffRank == null || staffRank === "NORMAL") ? getPackageRank() : getSpecialRank();
    }

    return getRank() + name;
}

export function colourParser(string) {

    function getHexColour(colourCode) {
        switch (colourCode) {
            case "0":
                return "#000000";
            case "1":
                return "#0000AA";
            case "2":
                return "#00AA00";
            case "3":
                return "#00AAAA";
            case "4":
                return "#AA0000";
            case "5":
                return "#AA00AA";
            case "6":
                return "#FFAA00";
            case "7":
                return "#AAAAAA";
            case "8":
                return "#555555";
            case "9":
                return "#5555FF";
            case "a":
                return "#55FF55";
            case "b":
                return "#55FFFF";
            case "c":
                return "#FF5555";
            case "d":
                return "#FF55FF";
            case "e":
                return "#FFFF55";
            case "f":
                return "#FFFFFF";
        }
    }

    function spanText(text, colourCode) {
        return "<span style='color: " + getHexColour(colourCode) + "; text-shadow: 1px 1px #000000;'>" + text + "</span>";
    }

    let newString = "";
    let stringList = string.split('');
    let segment = "";
    let colour = "";
    let i = 0;

    while (i < stringList.length) {
        if (stringList[i] === "§") {
            if (segment !== "") newString += spanText(segment, colour);
            segment = ""; // clear segment
            colour = stringList[i+1]; // set colour for upcoming segment
            i++; // skip over the colour code
        } else {
            segment += stringList[i];
        }
        i++;
    }

    return newString + spanText(segment, colour); // add last segment
}