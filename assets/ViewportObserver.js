var limit =10;
var page= 1;
var url_string = window.location.href; 
var url = new URL(url_string);
var bulan = ["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
var monthlist=["","Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des"];
var sku_type =["","","Double","Triple","Quad"];
var filter_uri="";

Number.prototype.toFixed2 = function(digits,separator){
  let res = this.toFixed(1)
  if(separator != '.'){
    res = res.replace('.',',')
  }

  return res
}

var sku_type_icon =["","",'<img src="https://dev.tahmeed.id/wp-content/uploads/2024/06/material-symbols_bed-outline.svg"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/06/material-symbols_bed-outline.svg">','<img src="https://dev.tahmeed.id/wp-content/uploads/2024/06/material-symbols_bed-outline.svg"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/06/material-symbols_bed-outline.svg"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/06/material-symbols_bed-outline.svg">','<img src="https://dev.tahmeed.id/wp-content/uploads/2024/06/material-symbols_bed-outline.svg"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/06/material-symbols_bed-outline.svg"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/06/material-symbols_bed-outline.svg"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/06/material-symbols_bed-outline.svg">'];

var star =["",'<img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols-light_star.svg">','<img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols-light_star.svg"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols-light_star.svg">','<img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols-light_star.svg"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols-light_star.svg"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols-light_star.svg">','<img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols-light_star.svg"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols-light_star.svg"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols-light_star.svg"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols-light_star.svg">','<img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols-light_star.svg"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols-light_star.svg"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols-light_star.svg"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols-light_star.svg"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols-light_star.svg">'];

var search= {
		sku_paket:url.searchParams.get("sku_paket")?url.searchParams.get("sku_paket"):"",
        query:url.searchParams.get("query")?url.searchParams.get("query"):"",
        paket:url.searchParams.get("paket")?url.searchParams.get("paket").split(','):[],//["Umrah Reguler","Umrah Plus","Haji Furoda","Halal Tour"],
        bulan:url.searchParams.get("bulan")?url.searchParams.get("bulan"):[],
        tahun:url.searchParams.get("tahun")?url.searchParams.get("tahun"):"",
		kota:url.searchParams.get("kota")?url.searchParams.get("kota"):[],
        harga_mulai:url.searchParams.get("harga_mulai")?url.searchParams.get("harga_mulai"):0,
        harga_akhir:url.searchParams.get("harga_akhir")?url.searchParams.get("harga_akhir"):0,
		kereta_cepat:url.searchParams.get("kereta_cepat")?url.searchParams.get("kereta_cepat"):"",
		city_tour:url.searchParams.get("city_tour")?url.searchParams.get("city_tour"):"",
		sort_by:url.searchParams.get("sort_by")?url.searchParams.get("sort_by"):"",
		sort_from:url.searchParams.get("sort_from")?url.searchParams.get("sort_from"):"",
		yearmonth:url.searchParams.get("yearmonth")?url.searchParams.get("yearmonth"):"",
		vendor:url.searchParams.get("vendor")?[url.searchParams.get("vendor")]:[],
		ustadz_kol:url.searchParams.get("ustadz_kol")?url.searchParams.get("ustadz_kol"):"",
		langsung:url.searchParams.get("langsung")?url.searchParams.get("langsung"):"",
    };

// console.log(search)
// get PROD
	function moreProd(){
        page+= 1;
        console.log(page);
        getProd("more");
    }
	function getSummaryResult(){
		
		let tmp=[];
		if(search.paket.length >0){
			tmp.push("Paket "+ search.paket.join(' & '));
		}
		if(search.yearmonth !=""){
			let year = search.yearmonth.split('---');
			let ym="";
			year.map(x=>{
				x.split('___')[0].split(',').map(y=>{
				ym += monthlist[y]+', ';
				})
				ym = ym.slice(0,-2)+' '+x.split('___')[1]+' & ';
			})
			tmp.push("Berangkat "+ym.slice(0,-3));
		}
		if(search.harga_mulai >0 && search.harga_akhir >0){ 
			tmp.push("Budget "+ 'Rp. '+(search.harga_mulai/1000000).toFixed2(2, ",")+'Jt - '+'Rp. '+(search.harga_akhir/1000000).toFixed2(2, ",")+'Jt');
		}else if(search.harga_mulai >0){
			tmp.push("Budget dari "+ 'Rp '+(search.harga_mulai/1000000).toFixed2(2, ",")+'Jt');
		}else if(search.harga_akhir >0){
			tmp.push("Budget sampai "+'Rp '+(search.harga_akhir/1000000).toFixed2(2, ",")+'Jt');
		}
		if(search.kota !=""){
			tmp.push("Kota "+ search.kota);
		}
		if(search.kereta_cepat !=""){ 
			tmp.push("Kereta Cepat");
		}
		if(search.city_tour !=""){ 
			tmp.push("Bonus City Tour");
		}
		if(search.ustadz_kol !=""){ 
			tmp.push("Dengan Ustadz");
		}
		if(search.langsung !=""){ 
			tmp.push("Langsung");
		}
		if(search.sort_by =="hotel_mekkah_distance"){ 
			tmp.push("Jarak Masjid Terdekat");
		}
		let generate = "";
		tmp.map(x=>{
			generate +='<div class="key_result">'+x+'</div>'
		})
		if(document.querySelector('#search_result')){
			document.querySelector('#search_result').innerHTML=generate;
		}		
// 		console.log(generate)
	}

	function getUri(){
		let uris="";
		if(search){
			uris += "&query="+search.query;
			if(search.paket.length >0){
				uris += "&paket="+ search.paket.toString();
			}
			if(search.bulan.length >0){
				uris += "&bulan="+ search.bulan.toString();
			}
			if(search.kota.length >0){
				uris += "&kota="+ search.kota.toString();
			}
			if(search.vendor.length >0){
				uris += "&travel="+ search.vendor.toString();
			}
			if(search.sku_paket !=""){ 
				uris += "&sku_paket="+ search.sku_paket;
			}
			if(search.kereta_cepat !=""){ 
				uris += "&kereta_cepat="+ search.kereta_cepat;
			}
			if(search.city_tour !=""){ 
				uris += "&city_tour="+ search.city_tour;
			}
			if(search.ustadz_kol !=""){ 
				uris += "&ustadz_kol="+ search.ustadz_kol;
			}
			if(search.langsung !=""){ 
				uris += "&langsung="+ search.langsung;
			}
			if(search.sort_by !=""){ 
				uris += "&sort_by="+ search.sort_by;
			}
			if(search.sort_from !=""){ 
				uris += "&sort_from="+ search.sort_from;
			}
			if(search.tahun !=""){ 
				uris += "&tahun="+ search.tahun;
			}
			if(search.harga_mulai >0){ 
				uris += "&harga_mulai="+ search.harga_mulai;
			}
			if(search.harga_akhir >0){ 
				uris += "&harga_akhir="+ search.harga_akhir;
			} 
			if(search.yearmonth !=""){ 
				uris += "&yearmonth="+ search.yearmonth;
			}
		}
		
		return uris;
	}

    function getProd(type="get"){
     let uris = getUri();
	if(filter_uri !=""){
		uris +=filter_uri;
	}
	loadingSearch(true)
	loadingMore(true)
	jQuery.ajax({
        method: 'GET',
        url: 'https://dev.tahmeed.id/wp-json/vm/v1/products/get?limit='+limit+"&page="+page+uris,
        // async : true,
        success: function (res) {
			if(res.length>limit){
				document.querySelector('#more').style.display="block";
				res = res.slice(1);
			}else{
				if(document.querySelector('#more')){
					document.querySelector('#more').style.display="none";
				}				
			}
			
            let prod = showProd(res,type);
            
			
			if(res.length <1){
				document.getElementById('products').innerHTML ='<div class="nf"><div class="elementor-icon" style="color:#B39E7D"><i aria-hidden="true" class="icon icon-file-3"></i></div><div class="msg">Tidak Ada Paket</div></div>'
			}
			
        }
    })
    
	}
 
   function getProdDet(sku="UHD-UR001JA"){
	jQuery.ajax({
        method: 'GET',
        url: 'https://dev.tahmeed.id/wp-json/vm/v1/product/detail/?sku_paket='+sku,
        // async : true,
        error:function(err){
			console.error(err)
		},
        success: function (res) {
            try{
              document.title = "Tahmeed.id | " + res[0].nama_paket;
              let berangkat = new Date(res[0].date_berangkat);
              let pulang = new Date(res[0].date_pulang);
              let lama_paket = (pulang - berangkat) / 86400000;
              let det_berangkat =
                +res[0].tanggal_berangkat +
                " " +
                bulan[res[0].bulan_berangkat] +
                " " +
                res[0].tahun_berangkat +
                " (" +
                lama_paket +
                " Hari)";
              let det_pulang =
                +res[0].tanggal_pulang +
                " " +
                bulan[res[0].bulan_pulang] +
                " " +
                res[0].tahun_pulang;
              let det_itinerary = "";
              for (let i = 0; i < res[0].itinerary.split("\n").length; i++) {
                if (
                  res[0].itinerary.split("\n")[i] != "" &&
                  res[0].itinerary.split("\n")[i] != " " &&
                  res[0].itinerary.split("\n")[i] != "\r" &&
                  res[0].itinerary.split("\n")[i] != " \r"
                ) {
                  det_itinerary +=
                    '<li><div class="dot"></div><div class="text">' +
                    res[0].itinerary.split("\n")[i] +
                    "</div></li>";
                }
              }

              if (res[0].itinerary.split("\n").length < 5) {
                document.querySelector(".button-see").style.display = "none";
              }

              let det_included = "";
              const included = res[0].included.split("\n");
              for (let i = 0; i < included.length; i++) {
                if (
                  i == 0 &&
                  included[i].toLowerCase().indexOf("termasuk") >= 0
                )
                  continue;
                if (i == 0 && included[i].toLowerCase().indexOf("include") >= 0)
                  continue;
                if (included[i].trim().length < 1) continue;
                det_included +=
                  '<li><div class="img" style="margin-right:8px"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/ph_check-circle-fill.svg" alt="img-circle" width="18" height="18"></div><div class="text">' +
                  included[i] +
                  "</div></li>";
              }

              let det_excluded = "";
              const excluded = res[0].excluded.split("\n");
              for (let i = 0; i < excluded.length; i++) {
                if (
                  i == 0 &&
                  excluded[i].toLowerCase().indexOf("termasuk") >= 0
                )
                  continue;
                if (i == 0 && excluded[i].toLowerCase().indexOf("exclude") >= 0)
                  continue;
                if (excluded[i].trim().length < 1) continue;
                det_excluded +=
                  '<li><div class="img" style="margin-right:8px"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols_cancel.svg" alt="img-circle" width="18" height="18"></div><div class="text">' +
                  excluded[i] +
                  "</div></li>";
              }
              let det_paket_pilihan = "";
              for (let i = 0; i < res.length; i++) {
                det_paket_pilihan +=
                  '<div class="card_paket"><div><div class="paket_name">Paket ' +
                  sku_type[res[i].type] +
                  '</div><div class="paket_image">' +
                  sku_type_icon[res[i].type] +
                  '</div></div><div class="paket_price">Rp ' +
                  (res[i].price / 1000000).toFixed2(2, ",") +
                  "jt <span>/pax</span></div></div>";
              }

              let det_info_biro =
                "<div>Name : " +
                res[0].vendor_name +
                "</div>" +
                // 				'<div>Established : 2016</div>'+
                // 				'<div>Pax per year : 10.000 Pax</div>'+
                "<div>No Izin : " +
                res[0].no_izin +
                "</div>" +
                "<div>Alamat : " +
                res[0].alamat +
                "</div>";
              // 				'<div>Source : xxxxxx</div>';
              if (res[0].tipe == "Umrah Plus") {
                document.querySelector("#hotel_plus_container").style.display =
                  "block";
              } else {
                document.querySelector("#hotel_plus_container").style.display =
                  "none";
              }

              if (res[0].ustadz_kol != "") {
                document.querySelector(".det_ustadz").style.display = "block";
                document.querySelector("#det_ustadz_kol").innerHTML =
                  "<span style='font-size:12px;'>Didampingi</span><br>" +
                  res[0].ustadz_kol;
              }

              if (res[0].tipe == "Halal Tour") {
                const containerEl = document.querySelector(".hotel-container");
                let el = containerEl.cloneNode(true);
                for (let dest of res[0].hotel_destinations) {
                  const destEl = el.cloneNode(true);
                  destEl.querySelector(".hotel-city span").innerHTML =
                    dest.city + ", " + dest.country;
                  destEl.querySelector("span.hotel-name").innerHTML =
                    dest.hotel_name;
                  destEl.querySelector(".hotel-distance").remove();
                  destEl.querySelector("span.hotel-star").innerHTML =
                    dest.hotel_star;
                  destEl.querySelector(".hotel-slider").innerHTML =
                    createSlider("plus", dest.photo_links.split("\n"));
                  containerEl.parentNode.insertBefore(
                    destEl,
                    containerEl.nextSibling
                  );
                }
                document.querySelector("#hotel_plus_container").remove();
                document.querySelector(".hotel-container-madinah").remove();
                containerEl.remove();

                document.querySelector(".tour-label span").innerHTML =
                  "Pilihan Paket";
                document.querySelector("#label-info-biro span div").innerHTML =
                  "Informasi Biro Perjalanan";

                document.querySelector(
                  "#list-destinasi-wisata .harga-paket-termasuk ul"
                ).innerHTML = res[0].bonus_city_tour
                  .split("\n")
                  .map((x) => {
                    return (
                      '<li><div class="img" style="margin-right:8px"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/ph_check-circle-fill.svg" alt="img-circle" width="18" height="18"></div><div class="text">' +
                      x +
                      "</div></li>"
                    );
                  })
                  .join("");
              } else {
                document.querySelector("#list-destinasi-wisata").remove();
                document.querySelector("#caption-destinasi-wisata").remove();
                document.querySelector("#hotel_madinah_slider").innerHTML =
                  createSlider(
                    "madinah",
                    res[0].hotel_madinah_link.split("\n")
                  );
                document.querySelector("#hotel_madinah_name").innerHTML =
                  res[0].hotel_madinah_name;
                document.querySelector("#hotel_madinah_distance").innerHTML =
                  res[0].hotel_madinah_distance;
                document.querySelector("#hotel_madinah_star").innerHTML =
                  res[0].hotel_madinah_star;
                document.querySelector("#hotel_mekkah_slider").innerHTML =
                  createSlider("mekkah", res[0].hotel_mekkah_link.split("\n"));
                document.querySelector("#hotel_mekkah_name").innerHTML =
                  res[0].hotel_mekkah_name;
                document.querySelector("#hotel_mekkah_distance").innerHTML =
                  res[0].hotel_mekkah_distance;
                document.querySelector("#hotel_mekkah_star").innerHTML =
                  res[0].hotel_mekkah_star;

                if (
                  res[0].tipe == "Umrah Plus" &&
                  res[0].hotel_plus_name != ""
                ) {
                  console.log(`Umrah Plus!`);
                  document.querySelector("#hotel_plus_slider").innerHTML =
                    createSlider("plus", res[0].hotel_plus_link.split("\n"));
                  document.querySelector("#hotel_plus_name").innerHTML =
                    res[0].hotel_plus_name;
                  document.querySelector("#hotel_plus_star").innerHTML =
                    res[0].hotel_plus_star;
                  if (res[0].kota_wisata_umroh_plus != "") {
                    document.querySelector(
                      ".hotel-plus-caption span"
                    ).innerHTML = res[0].kota_wisata_umroh_plus;
                  }
                } else {
                  document.querySelector("#hotel_plus_container").remove();
                }
              }
              // Non-Specific

              document.querySelector("#flyer_biro_slider").innerHTML =
                createSlider("flayer", res[0].flyer_biro.split("\n"));
              document.querySelector("#det_nama_paket").innerHTML =
                res[0].nama_paket;
              document.querySelector("#det_logo").src = res[0].logo
                ? res[0].logo
                : "https://dev.tahmeed.id/wp-content/uploads/woocommerce-placeholder.png";
              document.querySelector("#det_no_izin").innerHTML = res[0].no_izin;
              document.querySelector("#det_vendor").innerHTML = res[0].vendor;
              document.querySelector("#det_berangkat_dari").innerHTML =
                res[0].kota_berangkat;
              document.querySelector("#det_berangkat").innerHTML =
                det_berangkat;
              document.querySelector("#det_pulang").innerHTML = det_pulang;
              document.querySelector("#det_maskapai").innerHTML =
                res[0].maskapai;

              document.querySelector("#list-itinerary ul").innerHTML =
                det_itinerary;
              document.querySelector(
                "#list-informasi-paket .harga-paket-termasuk ul"
              ).innerHTML = det_included;
              document.querySelector(
                "#list-informasi-paket .harga-paket-tidak-termasuk ul"
              ).innerHTML = det_excluded;
              document.querySelector("#paket_pilihan").innerHTML =
                det_paket_pilihan;
              document.querySelector("#det_info_biro").innerHTML =
                det_info_biro;

              let deskripsi = res[0].deskripsi
                ? res[0].deskripsi
                : "belum ada deskripsi";


              if (
                deskripsi !== "belum ada deskripsi" &&
                deskripsi.includes("-")
              ) {
 
                let deskripsiList = deskripsi.split("-");


                let bulletPoints = "<ul>";
                deskripsiList.forEach((item) => {
                  if (item.trim() !== "") {
                    bulletPoints += `<li>${item.trim()}</li>`; 
                  }
                });
                bulletPoints += "</ul>";

                document.querySelector("#det_deskripsi").innerHTML =
                  bulletPoints;
              } else {
                document.querySelector("#det_deskripsi").innerHTML = deskripsi;
              }

              let checkloc = -1;
              let bandingbtn = "";
              if (localStorage.getItem("bandingkan_paket")) {
                checkloc = localStorage
                  .getItem("bandingkan_paket")
                  .split(",")
                  .indexOf(res[0].sku_paket);
              }
              if (checkloc !== -1) {
                bandingbtn =
                  '<div class="batalbandingkan" id="' +
                  res[0].sku_paket +
                  '" onclick="bandingkan(this.id)"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/Vector-1.svg"><span>Hapus</span></div>';
              } else {
                bandingbtn =
                  '<div class="bandingkan" id="' +
                  res[0].sku_paket +
                  '" onclick="bandingkan(this.id)">Bandingkan</div>';
              }

              document.querySelector("#detail_bandingkan").innerHTML =
                bandingbtn;

              jQuery.ajax({
                method: "GET",
                url:
                  "https://dev.tahmeed.id/wp-json/vm/v1/favorite/get?user_id=" +
                  document
                    .querySelector("meta[name='u_id']")
                    .getAttribute("value"),
                success: function (e) {
                  let skulist = [];
                  if (e[0]) {
                    skulist = e[0].sku_ids.split(",");
                  }
                  let favImg =
                    "https://dev.tahmeed.id/wp-content/uploads/2024/07/ph_star.webp";
                  if (skulist.indexOf(res[0].sku_paket) != "-1") {
                    favImg =
                      "https://dev.tahmeed.id/wp-content/uploads/2024/07/str.webp";
                  }
                  console.log(favImg);
                  document.querySelector("#favbtn").src = favImg;
                },
              });
            }catch(e){
				console.error(e)
			}
        }
    })
    
	}
function _star(num = 0){
	let txt = '<div class="star">'
	for(let i = 0;i < num;i++){ 
    txt += '<img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols-light_star.svg">'
	}
    txt += '</div>'
	
	return txt
}
function getCompare(skus){
   
    
	jQuery.ajax({
        method: 'GET',
        url: 'https://dev.tahmeed.id/wp-json/vm/v1/product/compare?skus='+skus,
        // async : true,
        success: function (res) {
//            console.log(res[1]);
           let val = res;
           let det_price="";
           let det_price2="";
           let durasi= ((new Date(val[0].date_pulang))-(new Date(val[0].date_berangkat)))/86400000;
           let durasi2= ((new Date(val[1].date_pulang))-(new Date(val[1].date_berangkat)))/86400000;
        
           val[0].sku_final.map(x=>{
               det_price +='<div class="paket_list"><div class="type"><span>Paket '+sku_type[x.type]+' :</span>'+sku_type_icon[x.type]+'</div><div class="price">Rp '+(x.price/1000000).toFixed2(2, ",")+' Jt <span>/pax</span></div></div>'
           })
           val[1].sku_final.map(x=>{
               det_price2 +='<div class="paket_list"><div class="type"><span>Paket '+sku_type[x.type]+' :</span>'+sku_type_icon[x.type]+'</div><div class="price">Rp '+(x.price/1000000).toFixed2(2, ",")+' Jt <span>/pax</span></div></div>'
           })
           
           let hotelPlus="";
           let hotelPlus2="";
           if(val[0].tipe == "Umrah Plus" && val[0].hotel_plus_name){
                hotelPlus='<div class="hotel">'+
                '<div class="hotel_type">Hotel Plus</div>'+
                '<div class="sub">Hotel Star :</div>'+
                '<div class="star">'+star[val[0].hotel_plus_star]+'</div>'+
                '<div class="sub">Nama Hotel :</div>'+
                '<div class="hotel_name">'+val[0].hotel_plus_name+'</div>'+
                '</div>';
           }
           if(val[0].tipe == "Umrah Plus" && val[1].hotel_plus_name){
                hotelPlus2='<div class="hotel">'+
                '<div class="hotel_type">Hotel Plus</div>'+
                '<div class="sub">Hotel Star :</div>'+
                '<div class="star">'+star[val[1].hotel_plus_star]+'</div>'+
                '<div class="sub">Nama Hotel :</div>'+
                '<div class="hotel_name">'+val[1].hotel_plus_name+'</div>'+
                '</div>';
           }
           let linkdet = "/detail-paket?sku_paket=";
           let comparePaket = '<div class="paket_name"><img src="'+val[0].logo+'" onerror="imgError(this)"><span onclick="window.location.href=\''+linkdet+val[0].sku_paket+'\'">'+val[0].nama_paket+'</span><div class="pesan" onclick="window.location.href=\'/booknow-login?sku_paket='+val[0].sku_paket+'\'">pesan</div></div><div class="vs">VS</div><div class="paket_name"><img src="'+val[1].logo+'" onerror="imgError(this)"><span onclick="window.location.href=\''+linkdet+val[1].sku_paket+'\'">'+val[1].nama_paket+'</span><div class="pesan" onclick="window.location.href=\'/booknow-login?sku_paket='+val[1].sku_paket+'\'">pesan</div></div>';
         
         let comparePrice ='<div class="paket_price line">'+det_price+'</div><div class="paket_price">'+det_price2+'</div>'
         let comparePenerbangan = '<div class="paket_penerbangan line">'+
            '<div class="sub">Maskapai : </div>'+
            '<div class="value">'+val[0].maskapai+'</div>'+
            '<div class="sub">Berangkat : </div>'+
            '<div class="value">'+val[0].tanggal_berangkat+' '+bulan[val[0].bulan_berangkat]+' '+val[0].tahun_berangkat+'</div>'+
            '<div class="sub">Pulang : </div>'+
            '<div class="value">'+val[0].tanggal_pulang+' '+bulan[val[0].bulan_pulang]+' '+val[0].tahun_pulang+'</div>'+
            '<div class="sub">Durasi : </div>'+
            '<div class="value">'+durasi+' Hari</div>'+
            '</div>'+
            '<div class="paket_penerbangan">'+
            '<div class="sub">Maskapai : </div>'+
            '<div class="value">'+val[1].maskapai+'</div>'+
            '<div class="sub">Berangkat : </div>'+
            '<div class="value">'+val[1].tanggal_berangkat+' '+bulan[val[1].bulan_berangkat]+' '+val[1].tahun_berangkat+'</div>'+
            '<div class="sub">Pulang : </div>'+
            '<div class="value">'+val[1].tanggal_pulang+' '+bulan[val[1].bulan_pulang]+' '+val[1].tahun_pulang+'</div>'+
            '<div class="sub">Durasi : </div>'+
            '<div class="value">'+durasi2+' Hari</div>'+
            '</div>'
            ;
        
        let compareHotel = ''
        if(val.filter(x=>x.tipe == 'Halal Tour').length > 0){
// 			alert("Halal Tour")
			const hotelDest1 = val[0].hotel_destinations.map(x=>{
				return '<div class="hotel">'+
				'<div class="hotel_type">'+x.hotel_name+'</div>'+
				'<div class="sub">'+x.city+', '+x.country+'</div>'+
				'<div class="star">'+_star(x.hotel_star)+'</div>'+
				'</div>'
			}).join("")
			const hotelDest2 = val[1].hotel_destinations.map(x=>{
				return '<div class="hotel">'+
				'<div class="hotel_type">'+x.hotel_name+'</div>'+
				'<div class="sub">'+x.city+', '+x.country+'</div>'+
				'<div class="star">'+_star(x.hotel_star)+'</div>'+
				'</div>'
			}).join("")
			compareHotel = '<div class="paket_hotel line">'+
				hotelDest1+
				'</div>'+
				'<div class="paket_hotel">'+
				hotelDest2+
				'</div>';
		}else{
			
// 			alert("Non Halal Tour")
			compareHotel = '<div class="paket_hotel line">'+
				'<div class="hotel">'+
				'<div class="hotel_type">Hotel Mekkah</div>'+
				'<div class="hotel_name">'+val[0].hotel_mekkah_name+'</div>'+
				'<div class="star">'+star[val[0].hotel_mekkah_star]+'</div>'+
				'<div class="sub">Jarak ke Masjidil Haram :</div>'+
				'<div class="distance">'+val[0].hotel_mekkah_distance+'m</div>'+
				'</div>'+
				'<div class="hotel">'+
				'<div class="hotel_type">Hotel Madinah</div>'+
				'<div class="hotel_name">'+val[0].hotel_madinah_name+'</div>'+
				'<div class="star">'+star[val[0].hotel_madinah_star]+'</div>'+
				'<div class="sub">Jarak ke Masjid Nabawi :</div>'+
				'<div class="distance">'+val[0].hotel_madinah_distance+'m</div>'+
				'</div>'+
				hotelPlus+
				'</div>'+
				'<div class="paket_hotel">'+
				'<div class="hotel">'+
				'<div class="hotel_type">Hotel Mekkah</div>'+
				'<div class="hotel_name">'+val[1].hotel_mekkah_name+'</div>'+
				'<div class="star">'+star[val[1].hotel_mekkah_star]+'</div>'+
				'<div class="sub">Jarak ke Masjidil Haram :</div>'+
				'<div class="distance">'+val[1].hotel_mekkah_distance+'m</div>'+
				'</div>'+
				'<div class="hotel">'+
				'<div class="hotel_type">Hotel Madinah</div>'+
				'<div class="hotel_name">'+val[1].hotel_madinah_name+'</div>'+
				'<div class="star">'+star[val[1].hotel_madinah_star]+'</div>'+
				'<div class="sub">Jarak ke Masjid Nabawi :</div>'+
				'<div class="distance">'+val[1].hotel_madinah_distance+'m</div>'+
				'</div>'+
				hotelPlus2+
				'</div>';
		}
            
        
        let fe1='';
        let fe2='';
        
        fe1 +=val[0].kereta_cepat==1?'<div class="list_fe"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/Group-1000005111.svg"><span>Kereta Cepat</span></div>':'';
        fe1 +=val[0].langsung==1?'<div class="list_fe"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/Group-1000005111.svg"><span>Langsung</span></div>':'';
        fe2 +=val[1].kereta_cepat==1?'<div class="list_fe"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/Group-1000005111.svg"><span>Kereta Cepat</span></div>':'';
        fe2 +=val[1].langsung==1?'<div class="list_fe"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/Group-1000005111.svg"><span>Langsung</span></div>':'';
        let compareFE='<div class="paket_fe line"><div class="sub">Harga Termasuk :</div>'+fe1+'</div>'+
        '<div class="paket_fe"><div class="sub">Harga Termasuk :</div>'+        fe2+'</div>';
        
        let included = "";
		const includedList1 = val[0].included.split("\n")
        for (let i=0;i<includedList1.length-1; i++){
			if(i == 0 && includedList1[i].toLowerCase().indexOf('termasuk') !== false) continue;
			if(includedList1[i].trim().length < 1) continue
            included +='<div class="list_fu"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/Group-1000005111.svg"><span>'+includedList1[i]+'</span></div>';
        }
        let included2 = "";
		const includedList2 = val[1].included.split("\n")
        for (let i=0;i<includedList2.length-1; i++){
			if(i == 0 && includedList2[i].toLowerCase().indexOf('termasuk')  !== false) continue;
			if(includedList2[i].trim().length < 1) continue
            included2 +='<div class="list_fu"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/Group-1000005111.svg"><span>'+includedList2[i]+'</span></div>';
        }
        let excluded = "";
		const excludedList1 = val[0].excluded.split("\n")
        for (let i=0;i<excludedList1.length-1; i++){
			if(i == 0 && excludedList1[i].toLowerCase().indexOf('termasuk')  !== false) continue;
			if(excludedList1[i].trim().length < 1) continue
            excluded +='<div class="list_fu"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols_cancel-1.svg"><span>'+excludedList1[i]+'</span></div>';
        }
        let excluded2 = "";
		const excludedList2 = val[1].excluded.split("\n");
        for (let i=0;i<excludedList2.length-1; i++){
			if(i == 0 && excludedList2[i].toLowerCase().indexOf('termasuk') !== false) continue;
			if(excludedList2[i].trim().length < 1) continue			
            excluded2 +='<div class="list_fu"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/material-symbols_cancel-1.svg"><span>'+excludedList2[i]+'</span></div>';
        }
        
        let compareFU='<div class="termasuk">'+
        '<div class="paket_fu line">'+
        '<div class="sub">Harga Termasuk :</div>'+
        included+
        '</div>'+
        '<div class="paket_fu">'+
        '<div class="sub">Harga Termasuk :</div>'+
        included2+
        '</div>'+
        '</div>'+
        '<div class="tidaktermasuk">'+
        '<div class="paket_fu line">'+
        '<div class="sub">Harga Tidak Termasuk :</div>'+
        excluded+
        '</div>'+
        '<div class="paket_fu">'+
        '<div class="sub">Harga Tidak Termasuk :</div>'+
        excluded2+
        '</div>'+
        '</div>';
            
          document.querySelector('#compare_paket').innerHTML=comparePaket;
          document.querySelector('#compare_price').innerHTML=comparePrice;
          document.querySelector('#compare_penerbangan').innerHTML=comparePenerbangan;
          document.querySelector('#compare_hotel').innerHTML=compareHotel;
          document.querySelector('#compare_fe').innerHTML=compareFE;
          document.querySelector('#compare_fu').innerHTML=compareFU;
          
        }
    })
    
}

    function showProd(prods,type){
        let templeate_prod="";
		
		let favDisplay = "block";
		
// 		if(document.querySelector("meta[name='u_id']").getAttribute('value') !=0){
// 			favDisplay ="block";
// 		}
		
		prods.map(x=>{
//             console.log(x)
			let tag_detail="";
			let tagdet = [];
			// let b = x.included.split("\n");

			let berangkat= new Date(x.date_berangkat);
			let pulang = new Date(x.date_pulang);
			let lama_paket = (pulang-berangkat)/86400000;
			let bandingbtn = "";
			if(x.tipe == 'Halal Tour'){
				x.bonus_city_tour.split('\n').forEach(x=>tagdet.push(x))
			}
			if(x.kereta_cepat >0){tagdet.push("Kereta Cepat")}
			if(x.langsung >0){tagdet.push("Langsung")}
			if(x.kota_wisata_umroh_plus !='' && x.tipe != 'Halal Tour'){tagdet.push("City Tour")}
			if(x.hotel_mekkah_distance <=200 && x.tipe != 'Halal Tour'){tagdet.push("Dekat Masjid")}
			if(x.ustadz_kol !='' &&  x.tipe != 'Halal Tour'){tagdet.push("Umroh Dengan Ustadz")}
			if (tagdet){
				if(tagdet.length > 4){
					for(let i=0; i<4; i++){
						tag_detail+='<div>'+tagdet[i]+'</div>';
					}
					tag_detail+='<div class="product-detail-tag-more">'+(tagdet.length-4)+'+</div>';
				}else{
					for(let i=0; i<tagdet.length; i++){
						tag_detail+='<div>'+tagdet[i]+'</div>';
					}
				}
			}
			let favImg="https://dev.tahmeed.id/wp-content/uploads/2024/07/ph_star.webp";			
			let checkloc=-1;
			if(localStorage.getItem("bandingkan_paket")){
				checkloc = localStorage.getItem("bandingkan_paket").split(",").indexOf(x.sku_paket);
			}
			// 			console.log(localStorage.getItem("bandingkan_paket").split(",").indexOf(x.sku_paket));
			if( checkloc !== -1){
				bandingbtn ='<div class="batalbandingkan" id="'+x.sku_paket+'" onclick="bandingkan(this.id)"><img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/Vector-1.svg"><span>Hapus</span></div>';
			}else{	
				bandingbtn ='<div class="bandingkan" id="'+x.sku_paket+'" onclick="bandingkan(this.id)">Bandingkan</div>';
			}
			let oc = "window.location.href='/detail-paket?sku_paket="+x.sku_paket+"'";
			let hotelInfo = ''
			if(x.tipe == 'Halal Tour'){
				hotelInfo = '<span>'+((x.hotel_destinations ?? []).length)+' Hotel</span>'				
			}else{
				hotelInfo = '<span>Hotel Star : '+x.hotel_madinah_star+' & '+x.hotel_mekkah_star+'</span>'							
			}
			templeate_prod+='<div class="product-card" data-id="'+x.sku_paket+'">'+
				'<div onclick="'+oc+'">'+
				'<div class="product-tag">'+
				x.tipe+
				'</div>'+
				'<div class="product-title">'+
				x.nama_paket+
				'</div>'+
				'</div>'+
				'<div class="product-maskapai">'+
				'<img class="product-maskapai-img" src="'+x.logo+'" onerror="imgError(this)">'+
				'<div class="product-maskapai-text"><b>'+x.vendor+'</b><br>Izin PPIU '+x.no_izin+'</div>'+
				'<img src="'+favImg+'" class="favorite" style="display:'+favDisplay+'" onclick="setFavorite(\''+x.sku_paket+'\',this)">'+
				'</div>'+
				'<div onclick="'+oc+'">'+
				'<div class="product-detail">'+
				'<div class="product-detail-left">'+
				'<div class="product-detail-list">'+
				'<img src="https://dev.tahmeed.id/wp-content/uploads/2024/06/mdi_flight.svg">'+
				'<span>'+x.maskapai+'</span>'+
				'</div>'+
				'<div class="product-detail-list">'+
				'<img src="https://dev.tahmeed.id/wp-content/uploads/2024/06/Vector.svg">'+
				hotelInfo+
				'</div>'+
				'<div class="product-detail-tag">'+
				tag_detail+
				'</div>'+
				'</div>'+
				'<div class="product-detail-right">'+
				'<div class="product-detail-sub">Jadwal</div>'+
				'<div class="product-detail-bold">'+x.tanggal_berangkat+' '+monthlist[x.bulan_berangkat]+' '+x.tahun_berangkat+' ('+lama_paket+' Hari)</div>'+
				'<div class="product-detail-sub"  style="margin-top:4px;">Dari</div>'+
				'<div class="product-detail-bold">'+x.kota_berangkat+'</div>'+
				'</div>'+
				'</div>'+
				'<div class="product-price">'+
				'<div class="product-price-left">'+
				'<span>'+sku_type[x.sku_type]+'</span>'+
				sku_type_icon[x.sku_type]+
				'</div>'+
				'<div class="product-price-right">'+
				'<div class="product-detail-sub">Harga Mulai Dari</div>'+
				'<div class="pricing">Rp '+(x.sku_price/1000000).toFixed2(2, ",")+' Jt<span class="pricing-sub">/Pax</span></div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="product-btn">'+
				'<a class="selengkapnya" href="/detail-paket?sku_paket='+x.sku_paket+'">Selengkapnya</a>'+bandingbtn+
				'</div>'+
				'</div>'


			// console.log(x);
		})


		// document.getElementById('products').innerHTML=templeate_prod;
		if(prods.length > 0){
			if(type=="get" || type=="first"){
				document.getElementById('products').innerHTML=templeate_prod;
			}else{
				document.getElementById('products').insertAdjacentHTML("beforeend", templeate_prod);

			}
		}
		
		getSummaryResult()
		loadingSearch(false);
		loadingMore(false)
		jQuery.ajax({
			method: 'GET',
			url: 'https://dev.tahmeed.id/wp-json/vm/v1/favorite/get?user_id='+document.querySelector("meta[name='u_id']").getAttribute('value'),
			success: function (res) {
				let skulist = [];
				if(res[0]){
					skulist =res[0].sku_ids.split(',');
				}
				const favImg="https://dev.tahmeed.id/wp-content/uploads/2024/07/str.webp";
				for(let sku of skulist){
					const selector = ".product-card[data-id='"+sku+"'] img.favorite"					
					try{
						document.querySelector(selector).src = favImg
					}catch(e){
// 						console.log(e)
					}
				}
				
				
			}
		})
    }


//////////bandingkan
function bandingkan(val){
//         console.log(this)
        let comp = localStorage.getItem("bandingkan_paket");
		//const toastAlert = bootstrap.Toast.getOrCreateInstance(document.querySelector('#alert-banding'))
		
// 		console.log(comp.split(",").indexOf(val));
        if(comp){
			if(comp.split(",").indexOf(val)==-1){
				if(comp.split(",").length>=5){
					//toastAlert.show();
					generatePopup("no-compare-gt5","Maksimum jumlah paket yang dapat dibandingkan adalah 5",true,'icon icon-cross-circle')
					return;
				}
				
				let firstCode=localStorage.getItem('bandingkan_paket').split(',')[0].split('-')[1].slice(0,2);
				let valCode=val.split('-')[1].slice(0,2);
				if( firstCode != valCode){
					if((firstCode=="UR" && valCode=="UP")||(valCode=="UR" && firstCode=="UP")){
						// console.log('umrah')
					}else{
						document.querySelector('.bandingkanpopupmsg').style.display="block";
						return;
					}
				}
				
				localStorage.setItem("bandingkan_paket", comp+","+val);
				document.querySelector("#"+val).classList.remove("bandingkan");
				document.querySelector("#"+val).classList.add("batalbandingkan");
				document.querySelector("#"+val).innerHTML='<img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/Vector-1.svg"><span>Hapus</span>';
			}else{
				let rcomp = localStorage.getItem("bandingkan_paket").split(",");
				rcomp.splice(rcomp.indexOf(val),1);
				localStorage.setItem("bandingkan_paket", rcomp.toString());
				document.querySelector("#"+val).classList.remove("batalbandingkan");
				document.querySelector("#"+val).classList.add("bandingkan");
				document.querySelector("#"+val).innerHTML="Bandingkan";
			}
        }else{
            localStorage.setItem("bandingkan_paket", val);
			document.querySelector("#"+val).classList.remove("bandingkan");
			document.querySelector("#"+val).classList.add("batalbandingkan");
			document.querySelector("#"+val).innerHTML='<img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/Vector-1.svg"><span>Hapus</span>';
        }
		
// 		if(comp.split(",").length<=1){
// 			document.querySelector('#banding').style.cursor="not-allowed";
// 		}else{
// 			document.querySelector('#banding').style.cursor="pointer";
// 		}
		
		if(url.pathname.indexOf('detail-paket')!=-1){
			console.log('detail paket');
			if(!comp || comp.split(",").indexOf(val)==-1){
				console.log('detail');
				document.querySelector('#wrap_compare_popup').style.display="block";
			}			
		}
	
		if(url.pathname.indexOf('/product-list')!=-1 || url.pathname.indexOf('/favorite-list')!=-1){
			
			if(localStorage.getItem('bandingkan_paket').split(',')[0] !=''){
				document.querySelector('#banding').style.display="block";
				document.querySelector('#banding').classList.add('active');
				document.querySelector('#hb').style.display="block";
				document.querySelector('#hu').style.display="none";
				if(document.querySelector('.minisearch')){
					document.querySelector('.minisearch').style.display="none";
				}
				
			}else{
				document.querySelector('#banding').style.display="none";
				document.querySelector('#banding').classList.remove('active');
				document.querySelector('#hb').style.display="none";
				document.querySelector('#hu').style.display="block";
				if(document.querySelector('.minisearch')){
					document.querySelector('.minisearch').style.display="flex";	
				}
			}
			document.querySelector('#banding').innerHTML="Mulai Bandingkan ("+localStorage.getItem('bandingkan_paket').split(',').length+"/5)";
		}
        // localStorage.removeItem("bandingkan_paket");
    }
    

function comparePopup(){
	
	window.location.href = "/product-list/#return-banding";
}
//     function removeBandingkan(val){
//         let comp = localStorage.getItem("bandingkan_paket").split(",");
//         comp.splice(comp.indexOf(val),1);
//         // console.log(comp);
//          localStorage.setItem("bandingkan_paket", comp.toString());
//     }


/////////////////////////////////SEARCH BOX////////////////////////////////////////////////

    
     var selectedMonth=[];
      //PAKET======================================
    function choosePaket(e){
		let hasUmrahInSearch = search.paket.filter(x=>x.indexOf('Umrah') >= 0).length > 0
		if(e.dataset.value.indexOf('Umrah') == -1){
			removePaket();						
		}
		if(!hasUmrahInSearch && e.dataset.value.indexOf('Umrah') >= 0){
			removePaket();	
		}
		if(search.paket.indexOf(e.dataset.value)==-1){
            search.paket.push(e.dataset.value);
			document.querySelector('#'+e.dataset.value.toLowerCase().replace(" ","_")).classList.add('active')
			if(document.querySelector('#'+e.dataset.value.toLowerCase().replace(" ",""))){
				document.querySelector('#'+e.dataset.value.toLowerCase().replace(" ","")).classList.add('active');
			}
			
			console.log(hasUmrahInSearch, e.dataset.value,search.paket)
			
//             e.classList.add('active')
        }else{
            search.paket.splice(search.paket.indexOf(e.dataset.value),1);
//             e.classList.remove('active')
			document.querySelector('#'+e.dataset.value.toLowerCase().replace(" ","_")).classList.remove('active')
			if(document.querySelector('#'+e.dataset.value.toLowerCase().replace(" ",""))){
				document.querySelector('#'+e.dataset.value.toLowerCase().replace(" ","")).classList.remove('active')
			}
		}
//         e.classList.add('active');
//         search.paket=e.dataset.value;
    }
    
    function removePaket(){
	  document.querySelectorAll(".search-paket div").forEach(el=>el.classList.remove('active'))
	  search.paket = []
		return;
      for(let i=0; i<4;i++){
        document.querySelectorAll(".search-paket div")[i].classList.remove('active');
      }
    }
    
    //YEAR MONTH===========================================
var gy=0;    
function showBulan(){
        let thisyear = new Date().getFullYear();
        let  sy = document.querySelector("#search_year");
    	if(gy==0){
			for(let y=0; y<3;y++){
				let option = document.createElement("option");
				option.text = thisyear+y;
				option.value=thisyear+y;
				sy.add(option)
			}
			gy=1;
		}
        sy.value=thisyear;
        
        let yv= search.tahun?search.tahun:thisyear;
        document.querySelector('#search_year').value =yv;
        generateMonth(yv);
        document.querySelector("#wrap-month").style.display="flex";
    };
    
    function changeYear(e){
        generateMonth(e.value);
    }
    
    function generateMonth(yv){
        var display_month="";
        jQuery.ajax({
            method: 'GET',
            url: 'https://dev.tahmeed.id/wp-json/vm/v1/product/month?tahun='+yv,
            // async : true,
            success: function (res) {
                console.log("bulan",res)
                let year = document.querySelector('#search_year').value;
                for (let i = 1; i < monthlist.length; i++) {
					let active="";
                    if(selectedMonth.includes(year+"-"+i)){
						active = "active"
					}
					if(res.includes(i.toString())){
                         display_month += '<div class="single-month '+active+'" id="month'+(i)+'" data-value="'+(i)+'" onclick="selectMonth(this.dataset.value)">'+monthlist[i]+'</div>'
                    }else{
                         display_month += '<div class="single-month" style="color:#B8B8B8;font-weight:400;cursor:not-allowed">'+monthlist[i]+'</div>'
                    }

                }
                document.querySelector(".display-month").innerHTML=display_month;
            }
        })
        
    }

function selectMonth(val){
		let year = document.querySelector('#search_year').value;
		let ym = year+"-"+val;
        if(selectedMonth.includes(ym)){
            selectedMonth.splice(selectedMonth.indexOf(ym), 1);
            document.querySelector("#month"+val).classList.remove("active");
        }else{
            selectedMonth.push(ym);
            document.querySelector("#month"+val).classList.add("active");
        }
        
    }
    
    function batalBulan(){
        document.querySelector("#wrap-month").style.display="none";
        selectedMonth = search.bulan;
    }
    
    function pilihBulan(){
		let yearMonth=[];
		
        for (let i = 0; i < selectedMonth.length; i++) {
			let yms = selectedMonth[i].split('-');
			if(typeof(yearMonth[yms[0]]) == "undefined"){
				yearMonth[yms[0]]=[yms[1]];
			}else{
				yearMonth[yms[0]].push(yms[1]);
			}
		}
		let disMonth="";
		let ymdb="";
		for (const key in yearMonth) { 
			let monthname="";
			yearMonth[key].sort(function (a, b) { return a - b });
			for (let i = 0; i < yearMonth[key].length; i++) {
				ymdb +=yearMonth[key][i]+",";
				monthname+=monthlist[yearMonth[key][i]]+", ";
			} 
			ymdb = ymdb.slice(0, -1)+"___"+key+"---";
			disMonth +=monthname.slice(0, -2)+" "+key+" & ";
		}
		search.yearmonth = ymdb.slice(0,-3); 
		document.querySelector("#wrap-month").style.display="none";
        document.querySelector("#search_bulan span").innerHTML=disMonth.slice(0, -2);
    }
    
    
    function priceFormat(e,status){
		return;
        const formatter = new Intl.NumberFormat('en-US');
        if(status =="out"){
        const formatted = formatter.format(e.value);
        document.querySelector("#"+e.id).type = "text";
            
        document.querySelector("#"+e.id).value =formatted;
        }else{
            document.querySelector("#"+e.id).value =e.value.replaceAll(",","")
            document.querySelector("#"+e.id).type = "number";
        }
        
    }
    
	function ableSearchKota(){
        document.querySelector('.list-kota').style.display="flex";
    }
    
    function searchKota(e){
        if(e.value.length <1){
            //  document.querySelector('.list-kota').style.display="none";
        }else{
            document.querySelector('.list-kota').style.display="flex";
            generateKota(e.value)
        }
    }
    
    function generateKota(key){
        jQuery.ajax({
            method: 'GET',
            url: 'https://dev.tahmeed.id/wp-json/vm/v1/product/kota-berangkat?kota='+key,
            success: function (res) {
                // console.log(res)
                let tmp="";
                if(res.length > 0){
                    res.map(x=>{
                        let active ="";
                        if(search.kota.indexOf(x.kota_berangkat)!=-1){
                            active=' class="active" ';
                        }
                        tmp +='<div '+active+' data-kota="'+x.kota_berangkat+'" onclick="selectKota(this)"><label>'+x.kota_berangkat+'</label><span>'+x.total+'</span></div>';
                    })
                }
                document.querySelector('.list-kota').innerHTML=tmp;
            }
        })
    }
    
    function selectKota(e){
        if(search.kota.indexOf(e.dataset.kota)==-1){
            search.kota.push(e.dataset.kota);
            e.classList.add('active')
        }else{
            search.kota.splice(search.kota.indexOf(e.dataset.kota),1);
            e.classList.remove('active')
        }
        
        generateSelectedKota();
    }
    
    function generateSelectedKota(){
        
        let tmp="";
        search.kota.map(x=>{
            tmp +='<div>'+x+'</div>';
        })
        document.querySelector('.selected-kota').innerHTML=tmp;
    }
    
    function searchFilter(){
        search.query=document.querySelector("#search_query").value;
        search.harga_mulai= document.querySelector("#start_price").value.replaceAll(",","");
        search.harga_akhir=document.querySelector("#end_price").value.replaceAll(",","");
        console.log(search);
        getProd();
		getFilter();	
    }
function processSearch(e,source){
// 	alert(e.value)
	console.log(e.value)
}    
function searchPaket(){
	search.query=document.querySelector("#search_query").value;
	search.harga_mulai= document.querySelector("#start_price").value.replaceAll(",","");
	search.harga_akhir=document.querySelector("#end_price").value.replaceAll(",","");
// // 	closeFilter();

// 	let uris="";
// 	if(search){
// 		uris += "&query="+search.query;
// 		uris += "&paket="+ search.paket;
// 		if(search.bulan.length >0){
// 			uris += "&bulan="+ search.bulan.toString();
// 		}
// 		uris += "&tahun="+ search.tahun;
// 		uris += "&harga_mulai="+ search.harga_mulai;
// 		uris += "&harga_akhir="+ search.harga_akhir;

// 	}
// 	
	let uris = getUri();
	btn = document.querySelector('#search_btn');
	btn.classList.add('loading');
	btn.innerHTML='<img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/Animation-1721716937019.gif">Memuat...';
	btn.removeAttribute('onclick');
	window.location.href="/product-list/?search=y"+uris;
}

    function showFilter(){
//         document.querySelector("#searchbox").style.display="flex";
        document.querySelector("#searchbox").classList.add('active')
		
    }
    
   function closeFilter(){
//         document.querySelector("#searchbox").style.display="none";
        document.querySelector("#searchbox").classList.remove('active')
    }

 function createSlider(name,data){
	 let templateSlider = '';
	if(data[0] ==''){return ''}
	 templateSlider +='<div id="slider-'+name+'" class="carousel slide">'+
		 '<div class="carousel-indicators">';
	 templateSlider += '<button type="button" data-bs-target="#slider-'+name+'" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>';
	 for(let i=1;i< data.length;i++){
		 templateSlider += '<button type="button" data-bs-target="#slider-'+name+'" data-bs-slide-to="'+i+'"  aria-label="Slide '+(1+i)+'"></button>';
	 }
	 templateSlider += '</div>'+
		 '<div class="carousel-inner">'+
		 '<div class="carousel-item active"><img src="'+data[0]+'" class="d-block w-100"></div>';
	 for(let i=1;i< data.length;i++){
		 templateSlider +='<div class="carousel-item"><img src="'+data[i]+'" class="d-block w-100 mr-1"></div>';
	 }
	 templateSlider +='</div>'+

		 '<button class="carousel-control-prev" type="button" data-bs-target="#slider-'+name+'" data-bs-slide="prev">'+
		 '<span class="carousel-control-prev-icon" aria-hidden="true"></span>'+
		 '<span class="visually-hidden">Previous</span>'+
		 '</button>'+

		 '<button class="carousel-control-next" type="button" data-bs-target="#slider-'+name+'" data-bs-slide="next">'+
		 '<span class="carousel-control-next-icon" aria-hidden="true"></span>'+
		 '<span class="visually-hidden">Next</span>'+
		 '</button>'+

		 '</div>';

	 return templateSlider;
 }

function imgError(e){
	e.src = 'https://dev.tahmeed.id/wp-content/uploads/woocommerce-placeholder.png';
	e.onerror = null;  
}


//------------------------------------------------------FILTER---------------------------------------------------------------------//
function getFilter(){
        let uris = getUri().substring(1);
        jQuery.ajax({
            method: 'GET',
            url: 'https://dev.tahmeed.id/wp-json/vm/v1/product/filter?'+uris,
            success: function (res) {
                // console.log(res)
                let tmp={};
                
                tmp.travel='';
                if(res.travel.length > 4 ){
                    res.travel.splice(-1);
                }else{
                    document.querySelector('#filter-travel .btnselengkapnya').style.display="none";
                }
                res.travel.map(x=>{
                    tmp.travel +='<div><div class="info-travel"><img src="'+x.logo+'" onerror="imgError(this)"><label>'+x.vendor_name+'</label></div><label class="cb"><input type="checkbox" value="'+x.vendor_name+'"><span class="checkmark"></span></label></div>'
                })
                
                tmp.maskapai='';
                if(res.maskapai.length > 4 ){
                    res.maskapai.splice(-1);
                }else{
                    document.querySelector('#filter-maskapai .btnselengkapnya').style.display="none";
                }
                res.maskapai.map(x=>{
                    tmp.maskapai +='<div><div class="info-travel"><label>'+x.maskapai+'</label></div><label class="cb"><input type="checkbox" value="'+x.maskapai+'"><span class="checkmark"></span></label></div>'
                })
                
                tmp.durasi='';
                if(res.durasi.length > 4 ){
                    res.durasi.splice(-1);
                }else{
                    document.querySelector('#filter-durasi .btnselengkapnya').style.display="none";
                }
                res.durasi.map(x=>{
                    tmp.durasi +='<div><div class="info-travel"><label>'+x.durasi+' Hari</label></div><label class="cb"><input type="checkbox" value="'+x.durasi+'"><span class="checkmark"></span></label></div>'
                })
				
				tmp.bulan='';
                res.bulan.map(x=>{
                    tmp.bulan +='<div><div class="info-travel"><label>'+bulan[x.bulan_berangkat]+'</label></div><label class="cb"><input type="checkbox" value="'+x.bulan_berangkat+'"><span class="checkmark"></span></label></div>'
                })
                
                tmp.dari='';
                if(res.dari.length > 4 ){
                    res.dari.splice(-1);
                }else{
                    document.querySelector('#filter-dari .btnselengkapnya').style.display="none";
                }
                res.dari.map(x=>{
                    tmp.dari +='<div><div class="info-travel"><label>'+x.kota_berangkat+'</label></div><label class="cb"><input type="checkbox" value="'+x.kota_berangkat+'"><span class="checkmark"></span></label></div>'
                })
                
                tmp.star='';  
                res.star.map(x=>{
                    if(x.hotel_mekkah_star>0){
                    tmp.star +='<div><div class="info-travel"><label>'+star[x.hotel_mekkah_star]+'</label></div><label class="cb"><input type="checkbox" value="'+x.hotel_mekkah_star+'"><span class="checkmark"></span></label></div>'
                    }
                })
                
                tmp.hotel='';
                if(res.hotel.length > 4 ){
                    res.hotel.splice(-1);
                }else{
                    document.querySelector('#filter-hotel .btnselengkapnya').style.display="none";
                }
                res.hotel.map(x=>{
                    tmp.hotel +='<div><div class="info-hotel"><label>'+x.hotel+'</label><span>Hotel Star '+x.star+'</span></div><label class="cb"><input type="checkbox" value="'+x.hotel+'"><span class="checkmark"></span></label></div>'
                })
                
                
                
                document.querySelector('#filter-travel .travel-select').innerHTML=tmp.travel;
                document.querySelector('#filter-maskapai .travel-select').innerHTML=tmp.maskapai;
                document.querySelector('#filter-durasi .travel-select').innerHTML=tmp.durasi;
                document.querySelector('#filter-bulan .travel-select').innerHTML=tmp.bulan;
                document.querySelector('#filter-dari .travel-select').innerHTML=tmp.dari;
                document.querySelector('#filter-star .travel-select').innerHTML=tmp.star;
                document.querySelector('#filter-hotel .travel-select').innerHTML=tmp.hotel;
                // console.log(tmp)
                
            }
        })
    }
    
    var filterSemua=[]
    function filterPilihSemua(e,type){
        // console.log(document.querySelectorAll('#filter-'+type+' .cb input')[0])
        if(filterSemua.indexOf(type)==-1){
            filterSemua.push(type)
            e.innerHTML='Batal Semua';
            for(i=0;i<document.querySelectorAll('#filter-'+type+' .cb input').length;i++){
                document.querySelectorAll('#filter-'+type+' .cb input')[i].checked=true;
            }
        }else{
            filterSemua.splice(filterSemua.indexOf(type),1);
            e.innerHTML='Pilih Semua';
            for(i=0;i<document.querySelectorAll('#filter-'+type+' .cb input').length;i++){
                document.querySelectorAll('#filter-'+type+' .cb input')[i].checked=false
            }
        }
    }
    
    
    function showFilterPaket(){
//         document.querySelector('.filter').style.display="flex";
        document.querySelector('#hu').style.display="none";
        document.querySelector('#hfp').style.display="block";
		
		
        document.querySelector('.filter').classList.add('active');
    }
    
    function closePaketFilter(){
		if(localStorage.getItem('bandingkan_paket') && localStorage.getItem('bandingkan_paket').split(',')[0] !=''){
			document.querySelector('#hu').style.display="none";
			document.querySelector('#hfp').style.display="none";
			document.querySelector('#hb').style.display="block";
		}else{
// 			document.querySelector('.filter').style.display="none";
        document.querySelector('.filter').classList.remove('active');
			document.querySelector('#hu').style.display="block";
			document.querySelector('#hfp').style.display="none";
			document.querySelector('#hb').style.display="none";
		}
        
    }
    
  
    function simpanFilterPaket(){
        let filterPaket=[];
        let type=['travel','maskapai','durasi','bulan','dari','star','hotel','ekslusif'];
        type.map(x=>{
            filterPaket[x]=[];
            if(document.querySelectorAll('#filter-'+x+' .cb input:checked').length > 0){
            for(let i=0; i<document.querySelectorAll('#filter-'+x+' .cb input:checked').length;i++){
                filterPaket[x].push(document.querySelectorAll('#filter-'+x+' .cb input:checked')[i].value);
            }
            }
        })
        filterURI="";
        search.harga_mulai = document.querySelector("#fstart_price").value?document.querySelector("#fstart_price").value:search.harga_mulai;
        search.harga_akhir=document.querySelector("#fend_price").value?document.querySelector("#fend_price").value:search.harga_akhir;
        filterPaket['jarak_mulai'] = document.querySelector("#jarak-mulai").value;
        filterPaket['jarak_sampai']=document.querySelector("#jarak-sampai").value;
        filter_uri = setFilterUri(filterPaket);
        getProd();
    }
    
    function setFilterUri(x){
        let type=['travel','maskapai','durasi','bulan','dari','star','hotel','ekslusif'];
        let urif="";
        type.map(y=>{
            if(x[y].length > 0){
                if(y=="dari"){
                    search.kota=x[y];
                }else if(y=="bulan"){
					search.bulan=x[y];
				}else if(y=="travel"){
					search.vendor=x[y];
				}else{
                    urif+="&"+y+"="+x[y].toString();
                }
            }
        })
        
        if(x['jarak_mulai']){
            urif +="&jarak_mulai="+x['jarak_mulai'];
        }
        if(x['jarak_sampai']){
            urif +="&jarak_sampai="+x['jarak_sampai'];
        }
        
        return urif;
    }
    
    function filterSelengkapnya(key){
        let uris = getUri();
        jQuery.ajax({
            method: 'GET',
            url: 'https://dev.tahmeed.id/wp-json/vm/v1/product/filter?limit=100000&type='+key+uris,
            success: function (res) {
                let tmp="";
                if(key =="travel"){
                    res.map(x=>{
                        tmp +='<div><div class="info-travel"><img src="'+x.logo+'" onerror="imgError(this)"><label>'+x.vendor_name+'</label></div><label class="cb"><input type="checkbox" value="'+x.vendor_name+'"><span class="checkmark"></span></label></div>'
                    })
                }
                if(key=="maskapai"){
                    res.map(x=>{
                        tmp +='<div><div class="info-travel"><label>'+x.maskapai+'</label></div><label class="cb"><input type="checkbox" value="'+x.maskapai+'"><span class="checkmark"></span></label></div>'
                    })
                }
                
                if(key=="durasi"){
                    res.map(x=>{
                        tmp +='<div><div class="info-travel"><label>'+x.durasi+' Hari</label></div><label class="cb"><input type="checkbox" value="'+x.durasi+'"><span class="checkmark"></span></label></div>'
                    })
                }
                
                if(key=="dari"){
                    res.map(x=>{
                        if(x.kota_berangkat){
                            tmp +='<div><div class="info-travel"><label>'+x.kota_berangkat+'</label></div><label class="cb"><input type="checkbox" value="'+x.kota_berangkat+'"><span class="checkmark"></span></label></div>'
                        }
                    })
                }
                
                if(key=="hotel"){
                    res.map(x=>{
                        tmp +='<div><div class="info-hotel"><label>'+x.hotel+'</label><span>Hotel Star '+x.star+'</span></div><label class="cb"><input type="checkbox" value="'+x.hotel+'"><span class="checkmark"></span></label></div>'
                    })
                }

                document.querySelector('#filter-'+key+' .travel-select').innerHTML=tmp;
                document.querySelector('#filter-'+key+' .travel-select').style.overflowY="scroll";
                document.querySelector('#filter-'+key+' .travel-select').style.maxHeight="300px";
                    /*max-height: 400px !important;*/
    /*overflow-y: hidden;*/
                document.querySelector('#filter-'+key+' .btnselengkapnya').style.display="none";
                
            }
        })
    }
    
    function resetFilterPaket(){
        for(i=0;i<document.querySelectorAll('.cb input').length;i++){
            document.querySelectorAll('.cb input')[i].checked=false
        }
        document.querySelector("#fstart_price").value="";
        document.querySelector("#fend_price").value="";
        document.querySelector("#jarak-mulai").value="";
        document.querySelector("#jarak-sampai").value="";
    }

function login(username,password){
        jQuery.ajax({
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            url: '/wp-json/vm/v1/user/login',
            data: JSON.stringify({
                user_login:username,
                user_password:password
            }),
            success: function (res) {
                console.log(res);
                if(res=="ok"){
                    window.location.href="/"
                }
            },
        })
    }
function logout(){
	return new Promise(resolve=>{
		jQuery.ajax({
			method: 'GET',
			url: 'https://dev.tahmeed.id/wp-json/vm/v1/user/logout',
			success: function (res) {
				window.location.reload();
			},
			error:function(error){
				console.error(error)
				resolve(false)
			}
		})
	})
}
function loadingSearch(v){
	btn = document.querySelector('#search_btn');
	btnf =document.querySelector('#filter_btn');
	btns =document.querySelector('#sort_btn');
	if(!btn || !btnf || !btns){
		return;
	}
	if(v){
		btn.classList.add('loading');
		btn.innerHTML='<img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/Animation-1721716937019.gif">Memuat...';
		btn.removeAttribute('onclick');
		
		btnf.classList.add('loading');
		btnf.innerHTML='<img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/Animation-1721716937019.gif">Memuat...';
		btnf.removeAttribute('onclick');
		
		btns.classList.add('loading');
		btns.innerHTML='<img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/Animation-1721716937019.gif">Memuat...';
		btns.removeAttribute('onclick');
	}else{
		btn.classList.remove('loading');
		btn.innerHTML='Cari Paket Sekarang';
		btn.setAttribute("onclick","searchFilter()")
		closeFilter();
		
		btnf.classList.remove('loading');
		btnf.innerHTML='Simpan Filter';
		btnf.setAttribute("onclick","simpanFilterPaket()")
		closePaketFilter();
		
		btns.classList.remove('loading');
		btns.innerHTML='Simpan';
		btns.setAttribute("onclick","simpanSortby()")
		closeSort();
	}
}

function loadingMore(v){
	btn = document.querySelector('#more');
	if(!btn){
		return;
	}
	if(v){
		btn.classList.add('loading');
		btn.innerHTML='<img src="https://dev.tahmeed.id/wp-content/uploads/2024/07/Animation-1721716937019.gif">Memuat...';
		btn.removeAttribute('onclick');
	}else{
		btn.classList.remove('loading');
		btn.innerHTML='Lihat Lebih Banyak';
		btn.setAttribute("onclick","moreProd()")
	}
}

function simpanSortby(){
    if(document.querySelector('.list-sortby input:checked')){
        let val = document.querySelector('.list-sortby input:checked').value;
        search.sort_by = val.split('__')[0]
        search.sort_from = val.split('__')[1]
        getProd();
    }
}

function showSort(){
    document.querySelector('#sort_popup').style.display="block";
}
function closeSort(){
    document.querySelector('#sort_popup').style.display="none";
}


function saveLog(type,sku_id,statusCallback = null){
	if(statusCallback){
		statusCallback('processing','Mohon Tunggu')
	}
	return new Promise(res=>{
		jQuery.ajax({
			method: 'POST',
			header: {
				'Content-Type': 'application/json'
			},
			url: '/wp-json/vm/v1/log/save',
			data: JSON.stringify({
				type:type,
				sku_id:sku_id,
				user_id:document.querySelector("meta[name='u_id']").getAttribute('value')
			}),
			success: async function (res) {
				console.log(res);
				if(type=="bandingkan"){
					if(statusCallback){
						statusCallback('waiting','Memproses Data')
					}
					var result = await generatePDF(sku_id);
					console.log(`Generate PDF Result `,result)
					if(!result.status){
						if(statusCallback){
							statusCallback(result.status, 'Error Memproses Data')
						}
					}else if(result.status!='success'){
						if(statusCallback){
							switch(result.status){
								case 'fail_need_verify':
									statusCallback(result.status, 'Mohon Verifikasi')
								default:
									
							}
						}
					}else{
						if(statusCallback){
							statusCallback('success','Sukses Memproses Data')
							localStorage.setItem('bandingkan_paket','')
						}
					}
				}
	//                 if(res=="ok"){
	//                     window.location.href="/"
	//                 }
			},
		})
	})
	
}


function generatePDF(){
	return new Promise(resolve=>{
		jQuery.ajax({
			method: 'POST',
			header: {
				'Content-Type': 'application/json'
			},
			url: 'https://export.tahmeed.id/generate_pdf',
			data: {
				email:document.querySelector("meta[name='u_email']").getAttribute('value'), 
				fullname:document.querySelector("meta[name='u_name']").getAttribute('value'), 
				phone:document.querySelector("meta[name='u_phone']").getAttribute('value'),
				sku_ids:localStorage.getItem('bandingkan_paket').split(',')
			},
			success: function (res) {
				console.log(res);
				resolve(res)
			},
			error:function(error){
				console.error(error)
				resolve(false)
			}
		})
	})
}

function getVendor(limit=9){
	return new Promise(resolve=>{
		btn = document.querySelector('#more_vendor');
			
		if(btn){btn.classList.add('loading')}
		jQuery.ajax({
			method: 'GET',
			url: 'https://dev.tahmeed.id/wp-json/vm/v1/product/filter?type=travel_highlight&limit='+(limit+1),
			success: function (res) {
				if (limit<res.length && btn){
					btn.style.display="block";
					res.splice(-1);
				}else{
					btn.style.display="none";
				}
				let tmp="";
				res.map(x=>{
					tmp+='<div class="vendorlist" onclick="window.location.href=\'/product-list?vendor='+x.vendor_name+'\'"><img src="'+x.logo+'" onerror="imgError(this)"></div>';
				})
				resolve(true)
				document.querySelector('.sec-vendor').innerHTML = tmp;
			},
			error:function(error){
				console.error(error)
				resolve(false)
			}
		})
		if(btn){btn.classList.add('remove')}
		
	})
}


function getHighlightEksklusif(){
	return new Promise(resolve=>{
		jQuery.ajax({
			method: 'GET',
			url: 'https://dev.tahmeed.id/wp-json/vm/v1/highlight/eksklusif',
			success: function (res) {
// 				console.log(res);
				let tmp ='<div class="highlights-wrap" style="width:'+(res.length*38)+'%">';
				res.map(x=>{
					tmp +='<div class="highlight" onclick="window.location.href=\''+x.cta+'&paket=Umrah Reguler,Umrah Plus\'" style="background-image:url('+x.image+')"><div>'+x.label+'</div></div>'
				})
				tmp += '</div>';
				document.querySelector('#highlights-eksklusif').innerHTML = tmp;
				resolve(true)
			},
			error:function(error){
				console.error(error)
				resolve(false)
			}
		})
	})
}

function getHighlightCityTour(){
	return new Promise(resolve=>{
		jQuery.ajax({
			method: 'GET',
			url: 'https://dev.tahmeed.id/wp-json/vm/v1/highlight/citytour',
			success: function (res) {
// 				console.log(res);
				let tmp ='<div class="highlights-wrap" style="width:'+(res.length*38)+'%">';
				res.map(x=>{
					tmp +='<div class="highlight" onclick="window.location.href=\'/product-list?city_tour='+x.label+'&paket=Umrah Reguler,Umrah Plus\'" style="background-image:url('+x.image+')"><div><span>Umrah Plus</span><label>'+x.label+'</label></div></div>'
				})
				tmp += '</div>';
				document.querySelector('#highlights-citytour').innerHTML = tmp;
				resolve(true)
			},
			error:function(error){
				console.error(error)
				resolve(false)
			}
		})
	})
}

function getFavorite(){
	jQuery.ajax({
			method: 'GET',
			url: 'https://dev.tahmeed.id/wp-json/vm/v1/favorite/get?user_id='+document.querySelector("meta[name='u_id']").getAttribute('value'),
			success: function (res) {	
				
				if(res.length>0){
					let skulist = res[0].sku_ids.split(',');
					skulist.splice(skulist.indexOf(""),1)
 					search.sku_paket = skulist;
					console.log(skulist);
					if(skulist < 1){
						search.sku_paket ="gak ada";
						document.getElementById('products').innerHTML ='<div class="nf"><div class="elementor-icon" style="color:#B39E7D"><i aria-hidden="true" class="icon icon-file-3"></i></div><div class="msg">Anda belum memilih paket favorit Anda</div></div>'
						document.querySelector('#lihatpaket').style.display="block";
						document.querySelector('#more').style.display="none";
					}else{
						getProd();
					}					
// 					let skulist =res[0].sku_ids.split(',');
// 					console.log(skulist);
				}
			},
			error:function(error){
				console.error(error)
			}
		})
}

function setFavorite(sku,e){
	let uid=document.querySelector("meta[name='u_id']").getAttribute('value');
	if(uid ==0){
		generatePopup("fav-login-required","Silahkan login untuk menyimpan favorite",true,"icon icon-enter",()=>{			
			location.href = `/login?redirect=`+window.location.href
		})
		setTimeout(()=>{
		},2000)
		return;
	}
	
	return new Promise(resolve=>{
		jQuery.ajax({
			method: 'GET',
			url: 'https://dev.tahmeed.id/wp-json/vm/v1/favorite/get?user_id='+uid,
			success: function (res) {	
				let skuids=res;
				let status="create";
				if(skuids.length>0){
					status="update";
					let skulist =skuids[0].sku_ids.split(',');
// 					console.log(skulist);
// 					return;
					if(skulist.indexOf(sku)=="-1"){
						skulist.push(sku);
						e.src="https://dev.tahmeed.id/wp-content/uploads/2024/07/str.webp";
					}else{
						skulist.splice(skulist.indexOf(sku),1);
						e.src="https://dev.tahmeed.id/wp-content/uploads/2024/07/ph_star.webp";
					}
					saveFavorite(skulist,status);
				}else{
					e.src="https://dev.tahmeed.id/wp-content/uploads/2024/07/str.webp";
					saveFavorite(sku,status);
				}
				
				console.log();

				resolve(true)
			},
			error:function(error){
				console.error(error)
				resolve(false)
			}
		})
	})
}

function saveFavorite(sku_id,status){
	return new Promise(resolve=>{
		jQuery.ajax({
			method: 'POST',
			header: {
				'Content-Type': 'application/json'
			},
			url: 'https://dev.tahmeed.id/wp-json/vm/v1/favorite/save',
			data: JSON.stringify({
				user_id:document.querySelector("meta[name='u_id']").getAttribute('value'), 
				sku_ids:sku_id.toString(),
				status:status
			}),
			success: function (res) {
				console.log(res);
				resolve(true)
			},
			error:function(error){
				console.error(error)
				resolve(false)
			}
		})
	})
}

function getHighlightsFuroda(){
	jQuery.ajax({
		method: 'GET',
		url: 'https://dev.tahmeed.id/wp-json/vm/v1/favorite/get?user_id='+document.querySelector("meta[name='u_id']").getAttribute('value'),
		success: function (res) {
			let skulist = [];
			if(res[0]){
				skulist =res[0].sku_ids.split(',');
			}
			let favDisplay = "block";
			// Tampilin aja meskipun belum login, nanti diminta login
// 			if(document.querySelector("meta[name='u_id']").getAttribute('value') !=0){
// 				favDisplay ="block";
// 			}
			jQuery.ajax({
				method: 'GET',
				url: 'https://dev.tahmeed.id/wp-json/vm/v1/highlight/haji-furoda',
				success: function (val) {
					let temp = '<div class="highlights-furoda" style="width:'+val.length*260+'px">';
					val.map(x=>{
						let favImg="https://dev.tahmeed.id/wp-content/uploads/2024/07/ph_star.webp";
						if(skulist.indexOf(x.sku_paket)!="-1"){
							favImg="https://dev.tahmeed.id/wp-content/uploads/2024/07/str.webp";
						}
						
						temp+= '<div class="list-furoda">'+
							'<div class="header-furoda">'+
							'<img class="logo" src="'+x.logo+'">'+
							'<div class="header-title">'+
							'<label>'+x.vendor_name+'</label>'+
							'<span>'+x.no_izin+'</span>'+
							'</div>'+
							'<img src="'+favImg+'" class="star" style="display:'+favDisplay+'" onclick="setFavorite(\''+x.sku_paket+'\',this)">'+
							'</div>'+
							'<div class="body-furoda" onclick="window.location.href=\'/detail-paket?sku_paket='+x.sku_paket+'\'">'+
							'<div>'+
							'<img src="https://dev.tahmeed.id/wp-content/uploads/2024/06/mdi_flight.svg">'+
							'<label>'+x.maskapai+'</label>'+
							'</div>'+
							'<div>'+
							'<img src="https://dev.tahmeed.id/wp-content/uploads/2024/06/Vector.svg">'+
							'<label>Hotel Star : '+x.hotel_mekkah_star+' & '+x.hotel_madinah_star+'</label>'+
							'</div>'+
							'<span>Harga Mulai Dari</span>'+
							'<label>'+(x.sku_price/1000000).toFixed2(2, ",")+' Jt<span>/ pax</span></label>'+
							'</div>'+
							'</div>';
						console.log(x);
					})
					temp+='</div>';
					document.querySelector('#highlights-furoda').innerHTML=temp;
				}
			});
		}
	})
// 	https://dev.tahmeed.id/wp-json/vm/v1/products/get?limit=10&page=1&query=&sort_by=price&sort_from=ASC
}
function searchOnEnter(e){
	if(e.key == 'Enter'){
		searchPaket()
	}
}
jQuery(function(){
	document.querySelectorAll('input.search-on-enter').forEach(function(el){
		el.addEventListener('keyup',searchOnEnter)
	})
})

// popup message Logout
function logoutPopup(){
	let pmsg = document.createElement("div");
	pmsg.innerHTML='<div class="logoutmsg">'+
	'<div class="body_popup">'+
	'<center>'+
	'<div class="elementor-icon" style="color:#B39E7D">'+
	'<i aria-hidden="true" class="icon icon-warning"></i>'+
	'</div>'+
	'</center>'+
	'<div class="title">Apakah Anda yakin ingin keluar?</div>'+
	'<div class="botton_popup">'+
	'<div class="btn btn-confirm" onclick="logout()">Keluar</div>'+
	'<div class="btn btn-cancel" onclick="document.querySelector(\'.logoutmsg\').style.display=\'none\'">Batal</div>'+
	'</div>'+
	'</div>'+
	'</div>'
	document.body.insertBefore(pmsg, document.body.firstChild);
}

function bandingkanPopup(){
	let pmsg = document.createElement("div");
	pmsg.innerHTML='<div class="popupmsg bandingkanpopupmsg">'+
	'<div class="body_popup">'+
	'<center>'+
	'<div class="elementor-icon" style="color:#B39E7D">'+
	'<i aria-hidden="true" class="icon icon-warning"></i>'+
	'</div>'+
	'</center>'+
	'<div class="title">Tidak Bisa Membandingkan Dengan Paket Ini!</div>'+
	'<div class="botton_popup">'+
	'<div class="btn btn-cancel" onclick="document.querySelector(\'.bandingkanpopupmsg\').style.display=\'none\'">Batal Bandingkan</div>'+
	'<div class="btn btn-confirm" onclick="resetBandingkan()">Reset Bandingkan</div>'+
	'</div>'+
	'</div>'+
	'</div>'
	document.body.insertBefore(pmsg, document.body.firstChild);
}

function generatePopup(kelas,msg,status=false,icon="icon icon-checkmark-circle", callback = null){
	let pmsg = document.createElement("div");
	pmsg.innerHTML='<div class="popupmsg '+kelas+'">'+
	'<div class="body_popup">'+
	'<center>'+
	'<div class="elementor-icon" style="color:#B39E7D">'+
	'<i aria-hidden="true" class="'+icon+'"></i>'+
	'</div>'+
	'</center>'+
	'<div class="title">'+msg+'</div>'+
	'<div class="botton_popup">'+
	'<div class="btn btn-confirm '+kelas+' " >Oke</div>'+
	'</div>'+
	'</div>'+
	'</div>'
	document.body.insertBefore(pmsg, document.body.firstChild);
	if(status){
		document.querySelector('.'+kelas).style.display="block";
	}	
	const el = pmsg.querySelector('div.btn.btn-confirm.'+kelas)
	console.log(el)
	el.addEventListener('click',()=>{
		if(callback){
			callback()
		}
		document.querySelector('.'+kelas).style.display='none'
	})
}

function resetBandingkan(){
	localStorage.removeItem('bandingkan_paket');
	document.querySelector('.bandingkanpopupmsg').style.display="none";
}