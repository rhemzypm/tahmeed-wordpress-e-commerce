<?php
include "user-register.php";
/**
 * Plugin Name: Plugin for Websites developed by Virus Media
 * Plugin URI: https://www.virus.co.id/
 * Description: This plugin contains everything that is required to do any custom things.
 * Version: 0.1
 * Author: Exairie
 * Author URI: https://www.virus.co.id/
 **/

//add create user


function get_products()
{
	global $wpdb;
	$search = "";
	$sort = "";
	$sortfrom = $_GET["sort_from"] ? $_GET["sort_from"] : "ASC";
	$exclusive = [];
	if(isset($_GET['ekslusif'])){
		foreach(explode(",",$_GET['ekslusif']) as $key){
			$_GET[trim($key)] = true;
		}
		
// 		var_dump($exclusive);
// 		exit();
	}
	// 	$search= $_GET["query"];

	if ($_GET["query"]) {
		$search .= " AND (a.nama_paket LIKE '%" . $_GET["query"] . "%' or a.vendor LIKE '%" . $_GET["query"] . "%' or a.maskapai LIKE '%" . $_GET['query'] . "%' or a.hotel_mekkah_name LIKE '%" . $_GET['query'] . "%' or a.hotel_madinah_name like '%" . $_GET['query'] . "%') ";
	}

	if ($_GET["paket"]) {
		if (str_contains($_GET["paket"], ",")) {
			$search .= " AND a.tipe IN ('" . join("','", explode(",", $_GET["paket"])) . "') ";
		} else {
			$search .= " AND a.tipe = '" . $_GET["paket"] . "' ";
		}
	}

	if ($_GET["yearmonth"]) {
		$ym = explode("---", $_GET["yearmonth"]);
		$search .= "AND (";
		foreach ($ym as $x) {
			$tanggal = explode("___", $x)[0];
			$tahun = explode("___", $x)[1];
			$search .= " (c.bulan_berangkat IN (" . $tanggal . ") AND c.tahun_berangkat = " . $tahun . ") OR";
		}
		$search = substr($search, 0, -2) . ")";
	} else {
		if ($_GET["bulan"]) {
			if (str_contains($_GET["bulan"], ",")) {
				$search .= " AND c.bulan_berangkat IN (" . $_GET["bulan"] . ") ";
			} else {
				$search .= " AND c.bulan_berangkat = " . $_GET["bulan"] . " ";
			}
		}
		if ($_GET["tahun"]) {
			$search .= " AND c.tahun_berangkat =" . $_GET["tahun"] . " ";
		}
	}
	if ($_GET["kota"]) {
		if (str_contains($_GET["kota"], ",")) {
			$search .= " AND a.kota_berangkat IN ('" . join("','", explode(",", $_GET["kota"])) . "') ";
		} else {
			$search .= " AND a.kota_berangkat = '" . $_GET["kota"] . "' ";
		}
	}

	if ($_GET["harga_mulai"] > 0 && $_GET["harga_akhir"] > 0) {
		$search .= " AND b.price BETWEEN " . $_GET["harga_mulai"] . " AND " . $_GET["harga_akhir"] . " ";
	}
	if ($_GET["harga_mulai"] > 0 && $_GET["harga_akhir"] <= 0) {
		$search .= " AND b.price > " . $_GET["harga_mulai"] . " ";
	}
	if ($_GET["harga_akhir"] > 0 && $_GET["harga_mulai"] <= 0) {
		$search .= " AND b.price < " . $_GET["harga_akhir"] . " ";
	}

	if ($_GET["sku_paket"]) {
		if (str_contains($_GET["sku_paket"], ",")) {
			$search .= " AND a.sku_paket IN ('" . join("','", explode(",", $_GET["sku_paket"])) . "') ";
		} else {
			$search .= " AND a.sku_paket = '" . $_GET["sku_paket"] . "' ";
		}
	}
	// 	if($_GET["sku_paket"]){
	// 		$search .= " AND a.sku_paket = '".$_GET["sku_paket"]."' ";
	// 	}

	if ($_GET["kereta_cepat"] || $exclusive['kereta_cepat']) {
		$search .= " AND a.kereta_cepat = " . $_GET["kereta_cepat"];
	} else if (in_array("Kereta Cepat", explode(',', $_GET['ekslusif']))) {
		$search .= " AND a.kereta_cepat = 1 ";
	}
	
	if ($_GET["langsung"] || $exclusive['langsung']) {
		$search .= " AND a.langsung = " . $_GET["langsung"];
	} else if (in_array("Langsung", explode(',', $_GET['ekslusif']))) {
		$search .= " AND a.langsung = 1 ";
	}

	if ($_GET['sort_by']) {
		$sort .= " ORDER BY " . $_GET['sort_by'] . " " . $sortfrom;
	}

	if ($_GET["city_tour"] || $exclusive['city_tour']) {
		if ($_GET["city_tour"] == 1) {
			$search .= " AND (a.kota_wisata_umroh_plus !='' AND a.tipe = 'Umrah Plus') ";
		} else {
			$search .= " AND (a.kota_wisata_umroh_plus LIKE '%" . $_GET["city_tour"] . "%' AND a.tipe = 'Umrah Plus')";
		}
	} else if (in_array("Free City Tour", explode(',', $_GET['ekslusif']))) {
		$search .= " AND a.bonus_city_tour !='' ";
	}

	if ($_GET["ustadz_kol"] || $exclusive['ustadz_kol']) {
		if ($_GET["ustadz_kol"] == 1) {
			$search .= " AND a.ustadz_kol !='' ";
		} else {
			$search .= " AND a.ustadz_kol LIKE '%" . $_GET["ustadz_kol"] . "%'";
		}
	}

	if ($_GET["travel"]) {
		if (str_contains($_GET["travel"], ",")) {
			$search .= " AND d.vendor_name IN ('" . join("','", explode(",", $_GET["travel"])) . "') ";
		} else {
			$search .= " AND d.vendor_name = '" . $_GET["travel"] . "' ";
		}
	}
	if ($_GET["maskapai"]) {
		if (str_contains($_GET["maskapai"], ",")) {
			$search .= " AND a.maskapai IN ('" . join("','", explode(",", $_GET["maskapai"])) . "') ";
		} else {
			$search .= " AND a.maskapai = '" . $_GET["maskapai"] . "' ";
		}
	}
	if ($_GET["durasi"]) {
		if (str_contains($_GET["durasi"], ",")) {
			$search .= " AND DATEDIFF(c.date_pulang,c.date_berangkat) IN ('" . join("','", explode(",", $_GET["durasi"])) . "') ";
		} else {
			$search .= " AND DATEDIFF(c.date_pulang,c.date_berangkat) = '" . $_GET["durasi"] . "' ";
		}
	}
	if ($_GET["star"]) {
		if (str_contains($_GET["star"], ",")) {
			$search .= " AND a.hotel_mekkah_star IN ('" . join("','", explode(",", $_GET["star"])) . "') ";
		} else {
			$search .= " AND a.hotel_mekkah_star = '" . $_GET["star"] . "' ";
		}
	}
	if ($_GET["hotel"]) {
		if (str_contains($_GET["hotel"], ",")) {
			$search .= " AND ( a.hotel_mekkah_name IN ('" . join("','", explode(",", $_GET["hotel"])) . "')  OR a.hotel_madinah_name IN ('" . join("','", explode(",", $_GET["hotel"])) . "') )";
		} else {
			$search .= " AND (a.hotel_mekkah_name = '" . $_GET["hotel"] . "' OR " . "a.hotel_madinah_name = '" . $_GET["hotel"] . "') ";
		}
	}
	if ($_GET["jarak_mulai"] > 0 && $_GET["jarak_sampai"] > 0) {
		$search .= " AND a.hotel_mekkah_distance BETWEEN " . $_GET["jarak_mulai"] . " AND " . $_GET["jarak_sampai"] . " ";
	}
	if ($_GET["jarak_mulai"] > 0 && $_GET["jarak_sampai"] <= 0) {
		$search .= " AND a.hotel_mekkah_distance > " . $_GET["jarak_mulai"] . " ";
	}
	if ($_GET["jarak_sampai"] > 0 && $_GET["jarak_mulai"] <= 0) {
		$search .= " AND a.hotel_mekkah_distance < " . $_GET["jarak_sampai"] . " ";
	}
	
	$search .= " AND c.date_berangkat >= cast(now() as date) ";



	$limit = $_GET['limit'] ? $_GET['limit'] : 100;
	$page = $_GET['page'] ? $_GET['page'] : 1;
	$offset = ($page - 1) * $limit;
	$lim = $limit + 1;
	$query = "SELECT a.id as skuid, c.id as departureid, a.* , MAX(b.type) sku_type, MIN(b.price) sku_price, b.sku_final,c.*,d.* FROM tahmeed_sku a LEFT JOIN tahmeed_sku_departure c ON a.id = c.sku_id LEFT JOIN tahmeed_sku_final b ON b.sku_departure_id = c.id  LEFT JOIN tahmeed_vendor d ON a.sku_paket LIKE CONCAT(d.vendor_code,'%') WHERE a.active = 1 " . $search . " GROUP BY a.sku_paket " . $sort . " LIMIT " . $lim . " OFFSET " . $offset;
	// 	return $query;
	$products = $wpdb->get_results($query);
	$halalTourIds = [];
	foreach ($products as $product) {
		if ($product->tipe == "Halal Tour") {
			$halalTourIds[] = $product->departureid;
		}
	}
	// 	var_dump($halalTourIds);
	if (count($halalTourIds) > 0) {
		$queryHalalTours = $wpdb->get_results("SELECT * FROM tahmeed_halal_tour_destination where sku_departure_id in (" . implode(",", $halalTourIds) . ")");
		foreach ($products as $product) {
			// 			var_dump($product->departureid);
			if ($product->tipe == "Halal Tour") {
				$product->hotel_destinations = array();
				$filtered = array_filter($queryHalalTours, function ($dest) use ($product) {
					$result = $dest->sku_departure_id == $product->departureid;
					// 					echo "Checking ".$dest->sku_departure_id." Against ".$product->departureid.":".$result."\r\n";
					return $result;
				});
				foreach ($filtered as $dest) {
					$product->hotel_destinations[] = $dest;
				}
			}
		}
	}
	return $products;
}

function get_detail_product()
{
	global $wpdb;
	$sku_paket = $_GET["sku_paket"];

	$query = "SELECT c.id as departureid, a.* , b.*,c.*,d.* FROM tahmeed_sku a LEFT JOIN tahmeed_sku_departure c ON a.id = c.sku_id LEFT JOIN tahmeed_sku_final b ON b.sku_departure_id = c.id  LEFT JOIN tahmeed_vendor d ON a.sku_paket LIKE CONCAT(d.vendor_code,'%') WHERE a.sku_paket = '" . $sku_paket . "' ORDER BY type DESC;";
	// 	return $query;
	$products = $wpdb->get_results($query);
	$halalTourIds = [];
	foreach ($products as $product) {
		if ($product->tipe == "Halal Tour") {
			$halalTourIds[] = $product->departureid;
		}
	}
	// 	var_dump($halalTourIds);
	if (count($halalTourIds) > 0) {
		$queryHalalTours = $wpdb->get_results("SELECT * FROM tahmeed_halal_tour_destination where sku_departure_id in (" . implode(",", $halalTourIds) . ")");
		foreach ($products as $product) {
			// 			var_dump($product->departureid);
			if ($product->tipe == "Halal Tour") {
				$product->hotel_destinations = array();
				$filtered = array_filter($queryHalalTours, function ($dest) use ($product) {
					$result = $dest->sku_departure_id == $product->departureid;
					// 					echo "Checking ".$dest->sku_departure_id." Against ".$product->departureid.":".$result."\r\n";
					return $result;
				});
				foreach ($filtered as $dest) {
					$product->hotel_destinations[] = $dest;
				}
			}
		}
	}
	return $products;
}

function get_compare_products()
{
	global $wpdb;
	$skus = join("','", explode(",", $_GET["skus"]));
	// 	$sku = explode(",",$_GET["skus"]);
	// 	$skus = $sku[count($sku)-1]."','".$sku[count($sku)-2];
	// 	return $skus;
	$limit = $_GET['limit'] ? $_GET['limit'] : 2;

	$query = "SELECT c.id departure_id, a.*,c.*, c.id as departureid,d.* FROM tahmeed_sku a LEFT JOIN tahmeed_sku_departure c ON a.id = c.sku_id LEFT JOIN tahmeed_vendor d ON a.sku_paket LIKE CONCAT(d.vendor_code,'%') WHERE a.sku_paket IN ('" . $skus . "') GROUP BY sku_paket LIMIT " . $limit;
	// 	return $query;
	$products = $wpdb->get_results($query);
	$result = [];
	// 	return $products;
	foreach ($products as $prod) {
		// 		return $prod->departure_id;
		$prod->sku_final = get_sku_final($prod->departure_id);
		array_push($result, $prod);
	}

	$halalTourIds = [];
	foreach ($products as $product) {
		if ($product->tipe == "Halal Tour") {
			$halalTourIds[] = $product->departureid;
		}
	}
	// 	var_dump($halalTourIds);
	if (count($halalTourIds) > 0) {
		$queryHalalTours = $wpdb->get_results("SELECT * FROM tahmeed_halal_tour_destination where sku_departure_id in (" . implode(",", $halalTourIds) . ")");
		foreach ($products as $product) {
			// 			var_dump($product->departureid);
			if ($product->tipe == "Halal Tour") {
				$product->hotel_destinations = array();
				$filtered = array_filter($queryHalalTours, function ($dest) use ($product) {
					$result = $dest->sku_departure_id == $product->departureid;
					// 					echo "Checking ".$dest->sku_departure_id." Against ".$product->departureid.":".$result."\r\n";
					return $result;
				});
				foreach ($filtered as $dest) {
					$product->hotel_destinations[] = $dest;
				}
			}
		}
	}
	return $result;
}

function get_sku_final($id)
{
	global $wpdb;
	$query = "SELECT sku_final,type,price FROM tahmeed_sku_final WHERE sku_departure_id	= " . $id . " ORDER BY type DESC";
	// 	return $query;
	$sku_final = $wpdb->get_results($query);
	return $sku_final;
}

function create_product(WP_REST_Request $request)
{
	global $wpdb;
	// 	return "lerem";
	$inputJSON = file_get_contents('php://input');
	$input = json_decode($inputJSON, TRUE);
	// 	return $input;


	$product = new WC_Product_Simple();
	$product->set_name($input['sku_final']); // product title
	// 	$product->set_slug( 'medium-size-wizard-hat-in-new-york' );
	$product->set_regular_price($input['price']); // in current shop currency
	$product->set_short_description('<p>Here it is... A WIZARD HAT!</p><p>Only here and now.</p>');
	// 	$product->set_description( 'long description here...' ); //set Description product
	$product->save();

	$dataSKUFinal = [
		// 		'sku_id' => $input['sku_id'],
		'wc_product_id' => $product->get_id(),
		//         'sku_departure_id' => $input['sku_departure_id'],
		'sku_final' => $input['sku_final'],
		'type' => $input['type'],
		'price' => $input['price']
	];

	$pr =    $wpdb->insert('tahmeed_sku_final', $dataSKUFinal);

	return $pr;
}

function create_sku($input)
{
	global $wpdb;
	$dataSKU = [
		'sku_paket' => $input['sku_paket'],
		'vendor' => $input['vendor'],
		'tipe' => $input['tipe'],
		'active' => $input['active'],
		'maskapai' => $input['maskapai'],
		'langsung' => $input['langsung'],
		'kereta_cepat' => $input['kereta_cepat'],
		'hotel_mekkah_name' => $input['hotel_mekkah_name'],
		'hotel_mekkah_star' => $input['hotel_mekkah_star'],
		'hotel_mekkah_link' => $input['hotel_mekkah_link'],
		'hotel_mekkah_distance' => $input['hotel_mekkah_distance'],
		'hotel_madinah_name' => $input['hotel_madinah_name'],
		'hotel_madinah_star' => $input['hotel_madinah_star'],
		'hotel_madinah_link' => $input['hotel_madinah_link'],
		'hotel_madinah_distance' => $input['hotel_madinah_distance'],
		'hotel_plus_name' => $input['hotel_plus_name'],
		'hotel_plus_star' => $input['hotel_plus_star'],
		'hotel_plus_link' => $input['hotel_plus_link'],
		'hotel_plus_distance' => $input['hotel_plus_distance'],
		'included' => $input['included'],
		'excluded' => $input['excluded'],
		'itinerary' => $input['itinerary'],
		'flyer_biro' => $input['flyer_biro'],
		'source' => $input['source'],
		'flag_update' => $input['flag_update'],
		'sk' => $input['sk'],
		'deskripsi' => $input['deskripsi']
	];

	$saveSKU = $wpdb->insert('tahmeed_sku', $dataSKU);
	return $saveSKU;
}

function get_skumonth()
{
	global $wpdb;
	$search = "";
	if ($_GET["tahun"]) {
		$search .= " WHERE tahun_berangkat =" . $_GET["tahun"] . " ";
	}

	$query = "SELECT bulan_berangkat,COUNT(bulan_berangkat) total_data,tahun_berangkat FROM `tahmeed_sku_departure` " . $search . " GROUP BY bulan_berangkat,tahun_berangkat";
	$month = $wpdb->get_results($query);
	$months = [];
	foreach ($month as $val) {
		array_push($months, $val->bulan_berangkat);
	}
	return $months;
}

function get_skuyear()
{
	global $wpdb;
	$search = "";
	$query = "SELECT tahun_berangkat,COUNT(bulan_berangkat) total_data FROM `tahmeed_sku_departure` " . $search . " GROUP BY tahun_berangkat ORDER BY tahun_berangkat ASC";
	$year = $wpdb->get_results($query);
	return $year;
}

function get_kota_berangkat()
{
	global $wpdb;
	$limit = $_GET['limit'] ? $_GET['limit'] : 4;
	$where = "";
	if ($_GET['kota']) {
		$where .= " WHERE kota_berangkat LIKE '%" . $_GET['kota'] . "%' ";
	}
	$query = "SELECT kota_berangkat, COUNT(id) total FROM `tahmeed_sku` " . $where . " GROUP BY kota_berangkat ORDER BY COUNT(id) DESC LIMIT " . $limit;
	$kota = $wpdb->get_results($query);
	return $kota;
}

function get_filter()
{
	global $wpdb;

	if ($_GET["query"]) {
		$where .= " AND (a.nama_paket LIKE '%" . $_GET["query"] . "%' or a.maskapai LIKE '%" . $_GET['query'] . "%' or a.hotel_mekkah_name LIKE '%" . $_GET['query'] . "%' or a.hotel_madinah_name like '%" . $_GET['query'] . "%') ";
	}

	if ($_GET["paket"]) {
		if (str_contains($_GET["paket"], ",")) {
			$where .= " AND a.tipe IN ('" . join("','", explode(",", $_GET["paket"])) . "') ";
		} else {
			$where .= " AND a.tipe = '" . $_GET["paket"] . "' ";
		}
	}
	// 	return str_contains($_GET["bulan"],",");
	if ($_GET["yearmonth"]) {
		$ym = explode("---", $_GET["yearmonth"]);
		$where .= "AND (";
		foreach ($ym as $x) {
			$tanggal = explode("___", $x)[0];
			$tahun = explode("___", $x)[1];
			$where .= " (c.bulan_berangkat IN (" . $tanggal . ") AND c.tahun_berangkat = " . $tahun . ") OR";
		}
		$where = substr($where, 0, -2) . ")";
	} else {
		if ($_GET["bulan"]) {
			if (str_contains($_GET["bulan"], ",")) {
				$where .= " AND c.bulan_berangkat IN (" . $_GET["bulan"] . ") ";
			} else {
				$where .= " AND c.bulan_berangkat = " . $_GET["bulan"] . " ";
			}
		}
		if ($_GET["tahun"]) {
			$where .= " AND c.tahun_berangkat =" . $_GET["tahun"] . " ";
		}
	}

	if ($_GET["kota"]) {
		if (str_contains($_GET["kota"], ",")) {
			$where .= " AND a.kota_berangkat IN ('" . join("','", explode(",", $_GET["kota"])) . "') ";
		} else {
			$where .= " AND a.kota_berangkat = '" . $_GET["kota"] . "' ";
		}
	}
	if ($_GET["harga_mulai"] > 0 && $_GET["harga_akhir"] > 0) {
		$where .= " AND b.price BETWEEN " . $_GET["harga_mulai"] . " AND " . $_GET["harga_akhir"] . " ";
	}
	if ($_GET["harga_mulai"] > 0 && $_GET["harga_akhir"] <= 0) {
		$where .= " AND b.price > " . $_GET["harga_mulai"] . " ";
	}
	if ($_GET["harga_akhir"] > 0 && $_GET["harga_mulai"] <= 0) {
		$where .= " AND b.price < " . $_GET["harga_akhir"] . " ";
	}

	if ($_GET["sku_paket"]) {
		$where .= " AND a.sku_paket = '" . $_GET["sku_paket"] . "' ";
	}

	if ($_GET["kereta_cepat"]) {
		$where .= " AND a.kereta_cepat = " . $_GET["kereta_cepat"];
	}

	if ($_GET['sort_by']) {
		$sort .= " ORDER BY " . $_GET['sort_by'] . " " . $sortfrom;
	}

	if ($_GET["city_tour"]) {
		if ($_GET["city_tour"] == 1) {
			$where .= " AND a.bonus_city_tour !='' ";
		} else {
			$where .= " AND a.bonus_city_tour LIKE '%" . $_GET["city_tour"] . "%'";
		}
	}

	$filter = [];
	$limit = $_GET['limit'] ? $_GET['limit'] : 5;
		$filter['travel'] = $wpdb->get_results("SELECT a.vendor as vendor_name,d.logo FROM tahmeed_sku a LEFT JOIN tahmeed_sku_departure c ON a.id = c.sku_id LEFT JOIN tahmeed_sku_final b ON b.sku_departure_id = c.id  LEFT JOIN tahmeed_vendor d ON a.sku_paket LIKE CONCAT(d.vendor_code,'%') WHERE a.active = 1 ".$where." GROUP BY vendor ORDER BY a.vendor asc LIMIT ".$limit);

	$filter['travel_highlight'] = $wpdb->get_results("select b.vendor_name, b.logo from tahmeed_ppiu_highlight a left join tahmeed_vendor b on a.vendor_id = b.id where a.active = 1 order by a.sort_order asc LIMIT " . $limit);
	
// 	echo "LIMIT : ".$limit;

	$filter['maskapai'] = $wpdb->get_results("SELECT a.maskapai FROM tahmeed_sku a LEFT JOIN tahmeed_sku_departure c ON a.id = c.sku_id LEFT JOIN tahmeed_sku_final b ON b.sku_departure_id = c.id  LEFT JOIN tahmeed_vendor d ON a.sku_paket LIKE CONCAT(d.vendor_code,'%') WHERE a.active = 1 " . $where . " GROUP BY a.maskapai ORDER BY a.maskapai asc LIMIT " . $limit);

	$filter['durasi'] = $wpdb->get_results("SELECT a.tipe,DATEDIFF(c.date_pulang,c.date_berangkat) durasi  FROM tahmeed_sku a LEFT JOIN tahmeed_sku_departure c ON a.id = c.sku_id LEFT JOIN tahmeed_sku_final b ON b.sku_departure_id = c.id  LEFT JOIN tahmeed_vendor d ON a.sku_paket LIKE CONCAT(d.vendor_code,'%') WHERE a.active = 1 " . $where . "  GROUP BY DATEDIFF(c.date_pulang,c.date_berangkat) ORDER BY DATEDIFF(c.date_pulang,c.date_berangkat) ASC LIMIT " . $limit);

	$filter['bulan'] = $wpdb->get_results("SELECT c.bulan_berangkat, count(a.id) total FROM tahmeed_sku a LEFT JOIN tahmeed_sku_departure c ON a.id = c.sku_id LEFT JOIN tahmeed_sku_final b ON b.sku_departure_id = c.id LEFT JOIN tahmeed_vendor d ON a.sku_paket LIKE CONCAT(d.vendor_code,'%') WHERE a.active = 1 " . $where . " GROUP BY c.bulan_berangkat ORDER BY c.bulan_berangkat");

	$filter['dari'] = $wpdb->get_results("SELECT a.kota_berangkat, COUNT(a.id) total FROM tahmeed_sku a LEFT JOIN tahmeed_sku_departure c ON a.id = c.sku_id LEFT JOIN tahmeed_sku_final b ON b.sku_departure_id = c.id  LEFT JOIN tahmeed_vendor d ON a.sku_paket LIKE CONCAT(d.vendor_code,'%') WHERE a.active = 1 " . $where . " GROUP BY a.kota_berangkat ORDER BY COUNT(a.id) DESC LIMIT " . $limit);

	$filter['star'] = $wpdb->get_results("SELECT a.hotel_mekkah_star, COUNT(a.id) total FROM tahmeed_sku a LEFT JOIN tahmeed_sku_departure c ON a.id = c.sku_id LEFT JOIN tahmeed_sku_final b ON b.sku_departure_id = c.id  LEFT JOIN tahmeed_vendor d ON a.sku_paket LIKE CONCAT(d.vendor_code,'%') WHERE a.active = 1 " . $where . " GROUP BY a.hotel_mekkah_star ORDER BY COUNT(a.id) DESC LIMIT " . $limit);

	$filter['hotel'] = $wpdb->get_results("SELECT a.hotel_mekkah_name hotel,a.hotel_mekkah_star as star, COUNT(a.id) total FROM tahmeed_sku a LEFT JOIN tahmeed_sku_departure c ON a.id = c.sku_id LEFT JOIN tahmeed_sku_final b ON b.sku_departure_id = c.id  LEFT JOIN tahmeed_vendor d ON a.sku_paket LIKE CONCAT(d.vendor_code,'%') WHERE a.active = 1 " . $where . " GROUP BY a.hotel_mekkah_name UNION SELECT a.hotel_madinah_name hotel,a.hotel_madinah_star as star, COUNT(a.id) total FROM tahmeed_sku a LEFT JOIN tahmeed_sku_departure c ON a.id = c.sku_id LEFT JOIN tahmeed_sku_final b ON b.sku_departure_id = c.id  LEFT JOIN tahmeed_vendor d ON a.sku_paket LIKE CONCAT(d.vendor_code,'%') WHERE a.active = 1 " . $where . " GROUP BY a.hotel_madinah_name ORDER BY total DESC LIMIT " . $limit);
	if ($_GET['type']) {
		return $filter[$_GET['type']];
	}
	return $filter;
}

function user_login(WP_REST_Request $request)
{
	$inputJSON = file_get_contents('php://input');
	$input = json_decode($inputJSON, TRUE);
	wp_clear_auth_cookie();
	$creds = array();
	$creds['user_login'] = $input['user_login'];
	$creds['user_password'] = $input['user_password'];
	$creds['remember'] = true;
	$user = wp_signon($creds, false);
	if (is_wp_error($user)) {
		return $user->get_error_message();
	} else {
		return "ok";
	}
}


function user_logout(WP_REST_Request $request)
{
	wp_clear_auth_cookie();
	return "Logouted";
}

function save_log(WP_REST_Request $request)
{
	global $wpdb;
	$inputJSON = file_get_contents('php://input');
	$input = json_decode($inputJSON, TRUE);


	if ($input['type'] == "bandingkan") {
		$dataLogs = [
			'sku_ids' => $input['sku_id'],
			'user_id' => $input['user_id']
		];
		$save = $wpdb->insert('tahmeed_bandingkan_logs', $dataLogs);
	} else {
		$dataLogs = [
			'sku_id' => $input['sku_id'],
			'user_id' => $input['user_id']
		];
		$save = $wpdb->insert('tahmeed_order_logs', $dataLogs);
	}
	return $save;
}

function get_paket_eksklusif_highlight()
{
	global $wpdb;
	$query = "SELECT * FROM tahmeed_paket_eksklusif_highlight where active = 1";
	$paket = $wpdb->get_results($query);
	return $paket;
}

function get_citytour_highlight()
{
	global $wpdb;
	$query = "SELECT * FROM tahmeed_citytour_highlight where active = 1";
	$paket = $wpdb->get_results($query);
	return $paket;
}

function get_banners()
{
	global $wpdb;
	$placement = $_GET['placement'];
	$query = "SELECT * FROM tahmeed_banners WHERE placement = '" . $placement . "' and active = 1 order by title asc";
	$banner = $wpdb->get_results($query);
	return $banner;
}

function get_favorites()
{
	global $wpdb;
	$query = "SELECT * FROM tahmeed_favorites WHERE user_id = " . $_GET['user_id'];
	$sku = $wpdb->get_results($query);
	return $sku;
}

function save_favorites(WP_REST_Request $request)
{
	global $wpdb;
	$inputJSON = file_get_contents('php://input');
	$input = json_decode($inputJSON, TRUE);

	// 	return $input;
	if ($input['status'] == "create") {
		$dataFav = [
			'sku_ids' => $input['sku_ids'],
			'user_id' => $input['user_id']
		];
		$save = $wpdb->insert('tahmeed_favorites', $dataFav);
	} else {
		$data_update = [
			"sku_ids" => $input['sku_ids'],
			"updated_at" => time()
		];
		$data_where = ["user_id" => $input['user_id']];
		$wpdb->update('tahmeed_favorites', $data_update, $data_where);
	}
	return $input['sku_ids'];
}
function get_highlight_furoda(){
	global $wpdb;
	$query = "SELECT a.id as skuid, c.id as departureid, a.* , MAX(b.type) sku_type, MIN(b.price) sku_price, b.sku_final,c.*,d.* FROM tahmeed_sku a LEFT JOIN tahmeed_sku_departure c ON a.id = c.sku_id LEFT JOIN tahmeed_sku_final b ON b.sku_departure_id = c.id  LEFT JOIN tahmeed_vendor d ON a.sku_paket LIKE CONCAT(d.vendor_code,'%') join tahmeed_haji_furoda_highlight e on a.sku_paket = e.sku WHERE a.active = 1 and e.active = 1 GROUP BY a.sku_paket order by e.position asc";
	// 	return $query;
	$products = $wpdb->get_results($query);
	return $products;
}
function init_endpoints()
{
	$namespace = "vm/v1";
	$route = 'woocommerce';

	register_rest_route($namespace, '/products/get', [
		'methods'   => 'GET',
		'callback'  => 'get_products'
	]);

	register_rest_route($namespace, '/product/detail', [
		'methods'   => 'GET',
		'callback'  => 'get_detail_product'
	]);

	register_rest_route($namespace, '/product/compare', [
		'methods'   => 'GET',
		'callback'  => 'get_compare_products'
	]);

	register_rest_route($namespace, '/product/month', [
		'methods'   => 'GET',
		'callback'  => 'get_skumonth'
	]);

	register_rest_route($namespace, '/product/year', [
		'methods'   => 'GET',
		'callback'  => 'get_skuyear'
	]);

	register_rest_route($namespace, '/product/kota-berangkat', [
		'methods'   => 'GET',
		'callback'  => 'get_kota_berangkat'
	]);

	register_rest_route($namespace, '/product/filter', [
		'methods'   => 'GET',
		'callback'  => 'get_filter'
	]);

	register_rest_route($namespace, '/user/login', [
		'methods'   => 'POST',
		'callback'  => 'user_login'
	]);

	register_rest_route($namespace, '/user/logout', [
		'methods'   => 'GET',
		'callback'  => 'user_logout'
	]);

	register_rest_route($namespace, '/log/save', [
		'methods'   => 'POST',
		'callback'  => 'save_log'
	]);

	register_rest_route($namespace, '/highlight/eksklusif', [
		'methods'   => 'GET',
		'callback'  => 'get_paket_eksklusif_highlight'
	]);

	register_rest_route($namespace, '/banners/get', [
		'methods'   => 'GET',
		'callback'  => 'get_banners'
	]);

	register_rest_route($namespace, '/highlight/citytour', [
		'methods'   => 'GET',
		'callback'  => 'get_citytour_highlight'
	]);

	register_rest_route($namespace, '/favorite/save', [
		'methods'   => 'POST',
		'callback'  => 'save_favorites'
	]);

	register_rest_route($namespace, '/favorite/get', [
		'methods'   => 'GET',
		'callback'  => 'get_favorites'
	]);
	
	register_rest_route($namespace, '/highlight/haji-furoda', [
		'methods'   => 'GET',
		'callback'  => 'get_highlight_furoda'
	]);

	register_rest_route($namespace, '/product/create', [
		'methods'   => 'POST',
		'callback'  => 'create_product'
	]);
	register_rest_route($namespace, '/account/verify', [
		'methods'   => 'GET',
		'callback'  => 'verify_account'
	]);
}

add_action('rest_api_init', 'init_endpoints');

// add_action('plugins_loaded', 'cmr_suregd_execute');
// function cmr_suregd_execute()
// {
//   add_filter('manage_users_columns', 'cmr_suregd_add_upwd_col');
//   function cmr_suregd_add_upwd_col($columns)
//   {
//     $columns['user_registered'] = 'Registration date';
//     return $columns;
//   }

//   add_action('manage_users_custom_column',  'cmr_suregd_show_upwd_col_data', 10, 3);
//   function cmr_suregd_show_upwd_col_data($value, $column_name, $user_id)
//   {
//     $user = get_userdata($user_id);
//     if ('user_registered' == $column_name)
//       return date("F d, Y h:i a", strtotime('+6 hours', strtotime($user->user_registered)));
//     return $value;
//   }
// }

function show_loggedin_name($atts)
{
	global $current_user, $user_login;
	get_currentuserinfo();
	add_filter('widget_text', 'do_shortcode');
	if ($user_login)
		return $current_user->display_name;
	else
		return '';
}
add_shortcode('show_loggedin_name', 'show_loggedin_name');

function show_loggedin_avatar($atts)
{
	global $current_user, $user_login;
	get_currentuserinfo();
	add_filter('widget_text', 'do_shortcode');
	if ($user_login)
		return get_avatar($current_user->ID, 32);
	else
		return '';
}
add_shortcode('show_loggedin_avatar', 'show_loggedin_avatar');

function show_loggedin_id($atts)
{
	global $current_user, $user_login;
	get_currentuserinfo();
	add_filter('widget_text', 'do_shortcode');
	if ($user_login)
		return $current_user->ID;
	else
		return '';
}
add_shortcode('show_loggedin_id', 'show_loggedin_id');


// Inject JS File

function virus_inject_js()
{
	//   wp_enqueue_script('section-tracker', plugin_dir_url(__FILE__) . '/assets/ViewportObserver.js', '1.0.0', ['jquery']);
	wp_enqueue_script('section-tracker', plugin_dir_url(__FILE__) . '/assets/ViewportObserver.js', array('jquery'), '1.0.1' . rand(0, 100), false);
	// 	 wp_enqueue_script( 'section-tracker', plugins_url( '/assets/ViewportObserver.js' , __FILE__ ));
}

add_action('wp_enqueue_scripts', 'virus_inject_js');

function insertMetaTag()
{
	$page_id = get_queried_object_id();
	global $current_user, $user_login;
	get_currentuserinfo();
	// 	add_filter('widget_text', 'do_shortcode');
	$uid = 0;

	if ($user_login) {
		$uid = $current_user->ID;
		echo "<meta name=\"u_email\" value=\"" . $current_user->user_email . "\"/>";
		echo "<meta name=\"u_name\" value=\"" . $current_user->user_firstname  . "\"/>";
		echo "<meta name=\"u_last_name\" value=\"" . $current_user->user_lastname  . "\"/>";
		$phone = get_user_meta($uid,'eael_phone_number',true);
		echo "<meta name=\"u_phone\" value=\"" . $phone  . "\"/>";
	}
	echo "<meta name=\"t_id\" value=\"" . $page_id . "\"/>";
	echo "<meta name=\"u_id\" value=\"" . $uid . "\"/>";
}
add_action('wp_head', 'insertMetaTag');

function my_ffl_display_name_just_first($display_name_order, $first_name, $last_name)
{

	$display_name_order = array($first_name, '');

	return $display_name_order;
}
add_filter('ffl_display_name_order', 'my_ffl_display_name_just_first', 15, 3);
