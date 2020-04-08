export function generateLeaderboard(results, lightmode, ign) {
    let tbody;
    for (let index in results[0]) {
        let record = "";

        if (results[0][index].ign === ign) {
            record += `<tr class='table-active ${(lightmode === "dark") ? "dark" : ""}'>`;
        } else {
            record += "<tr>";
        }

        switch (index) {
            case "0":
                record += `<th scope='row'><i class='fa fa-trophy' style='color: gold;' title='#1 Quester'></i> ${parseInt(index) + 1}</th>`;
                break;
            case "1":
                record += `<th scope='row'><i class='fa fa-trophy' style='color: silver;' title='#2 Quester'></i> ${parseInt(index) + 1}</th>`;
                break;
            case "2":
                record += `<th scope='row'><i class='fa fa-trophy' style='color: #A67D3D;' title='#3 Quester'></i> ${parseInt(index) + 1}</th>`;
                break;
            default:
                record += `<th scope='row'>${parseInt(index) + 1}</th>`;
        }

        if (results[0][index].ign === ign) {
            record += `<td><a href='/quests/${results[0][index].uuid}'><b>${results[0][index].ign}</b></a></td>`;
        } else {
            record += `<td><a href='/quests/${results[0][index].uuid}'>${results[0][index].ign}</a></td>`;
        }

        record += `<td>${results[0][index].quests}</td>`;
        tbody += record;
    }
    return tbody;
}