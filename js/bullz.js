var public_api_node = 'https://node1.mainnet.hathor.network/v1a/transaction?id=';
var public_explorer_tx = 'https://explorer.hathor.network/transaction/';

var img = document.createElement('img');
img.setAttribute('style', 'width: 20%; height: 20%;');

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
                var h5_tx_id = document.getElementById('lbl-tx-id');
                var h5_name = document.getElementById('lbl-name');
                var h5_desc = document.getElementById('lbl-desc');
                var h5_att_id = document.getElementById('att-id');
                var h5_att_hash = document.getElementById('att-hash');

                h5_tx_id.innerHTML = tx_id;
                h5_tx_id.href = public_explorer_tx+tx_id;
                h5_name.innerHTML = data["name"];
                h5_desc.innerHTML = data["description"];
                h5_att_id.innerHTML = data["attributes"][0]["value"];
                h5_att_hash.innerHTML = data["attributes"][1]["value"];

                // Cria a imagem dentro do html
                div.appendChild(img);
                img.src = pegaIpfs(data["file"]);
                div.appendChild(img);

            });
        } );

    });

});

function pegaIpfs(data){
    var url = "";

    // Não sou muito bom em regex, de repente voce faz algo melhor. Desculpe a bagunça
    //converte de base64 para string
    try {
        var ipfs_decoded = atob(data);
        let reg = /(ipfs:\/)(\/\w+\/\w+\/[\w+_-]*.)+(json|jpg|png|gif)/gm;
        let result = reg.exec(ipfs_decoded);
        url = result[2].concat(result[3]);
    }catch(e){
        let reg = /(ipfs:\/)(\/\w+\/\w+\/[\w+_-]*.)+(json|jpg|png|gif)/gm;
        let result = reg.exec(data);
        url = result[2].concat(result[3]);
    }

    return "https://ipfs.io".concat(url);
}