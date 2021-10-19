var public_api_node = 'https://node1.mainnet.hathor.network/v1a/transaction?id=';
var public_explorer_tx = 'https://explorer.hathor.network/transaction/';

var img = document.createElement('img');
img.setAttribute('style', 'width: 75%; height: 75%;');

$("#get-data").on('click', function(event){
	event.preventDefault();
    var tx_id = document.getElementById("tx-id").value;

    // Faz um get direto para a api do full node
    $.getJSON(public_api_node.concat(tx_id), (data) => {
        var tx_uid = data["tx"]["tokens"][0]["uid"];

        $.getJSON(public_api_node.concat(tx_uid)).then(function(get_ipfs_url) {
            //O true pede para função fazer a conversao de base64 to string
            var json_nft = pegaIpfs(get_ipfs_url["tx"]["outputs"][0]["script"]);

            $.getJSON(json_nft, (data) => {

                var div = document.getElementById('show-nft');
                var div_direita = document.getElementById('div_direita');
                var h5_tx_id = document.getElementById('lbl-tx-id');
                clearElement(h5_tx_id);
                var h5_name = document.getElementById('lbl-name');
                clearElement(h5_name);
                var h5_desc = document.getElementById('lbl-desc');
                clearElement(h5_desc);
                var att_list = document.getElementById('att_list');
                clearElement(att_list);



                h5_tx_id.innerHTML = tx_id;
                h5_tx_id.href = public_explorer_tx+tx_id;
                h5_name.innerHTML = data["name"];
                h5_desc.innerHTML = data["description"];



                for(var i=0;i <  Object.keys(data["attributes"]).length;i++){

                    var li = document.createElement('li');
                    li.setAttribute('class',"list-group-item d-flex justify-content-between align-items-sm-start");
                    var div_1 = document.createElement('div');
                    div_1.setAttribute('class',"ms-2 me-auto");
                    var div_2 = document.createElement('div');
                    div_2.setAttribute('class',"fw-bold");
                    div_2.innerHTML = data["attributes"][i]["type"];
                    var lbl_content = document.createElement('label');
                    lbl_content.innerHTML = data["attributes"][i]["value"];

                    li.appendChild(div_1);
                    div_1.appendChild(div_2);
                    div_1.appendChild(lbl_content);
                    att_list.appendChild(li);
                }

                // Cria a imagem dentro do html

                div_direita.appendChild(img);
                img.src = pegaIpfs(data["file"]);
                div_direita.appendChild(img);

            });
        } );

    });

});

function clearElement(element){
    element.innerHTML = "";
}

function pegaIpfs(data){
    var url = "";

    // Não sou muito bom em regex, de repente voce faz algo melhor. Desculpe a bagunça
    //converte de base64 para string
    try {
        var ipfs_decoded = atob(data);
        let reg = /(ipfs:\/)(\/\w+\/\w+)(\/[\w+_-]*.json|\/[\w+_-]*.jpg|\/[\w+_-]*.png|\/[\w+_-]*.gif|)/gm;
        let result = reg.exec(ipfs_decoded);
        url = result[2].concat(result[3]);
    }catch(e){
        let reg = /(ipfs:\/)(\/\w+\/\w+)(\/[\w+_-]*.json|\/[\w+_-]*.jpg|\/[\w+_-]*.png|\/[\w+_-]*.gif|)/gm;
        let result = reg.exec(data);

        if(result[3]){
            url = result[2].concat(result[3]);
        }else {
            url = result[2];
        }

    }

    return "https://ipfs.io".concat(url);
}