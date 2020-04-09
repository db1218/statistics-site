export function generateLeaderboard(results, lightmode, ign) {
    let tbody = "";
    for (let index in results) {
        let record = "";

        if (results[index].ign === ign) {
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

        if (results[index].ign === ign) {
            record += `<td><a href='/quests/${results[index].uuid}'><b>${results[index].ign}</b></a></td>`;
        } else {
            record += `<td><a href='/quests/${results[index].uuid}'>${results[index].ign}</a></td>`;
        }

        record += `<td>${results[index].quests}</td>`;
        if (results[index].month != null) record += `<td>${moment(results[index].month).format("MMM YYYY")}</td>`;
        tbody += record;
    }
    return tbody;
}