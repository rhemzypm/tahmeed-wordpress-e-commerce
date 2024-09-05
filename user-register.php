<?php

function generateRandomString($length = 10)
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';

    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[random_int(0, $charactersLength - 1)];
    }

    return $randomString;
}

function sendVerificationEmail($user_id)
{

    $user = get_user_by('id', $user_id);

    $verifyCode = generateRandomString(32);

    $userdata = [];
    $userdata['ID'] = $user_id;
    $userdata['tahmeed_verify_code'] = $verifyCode;


    add_user_meta($user_id, 'tahmeed_verify_code', $verifyCode, true);
    add_user_meta($user_id, 'tahmeed_verify_status', 0, true);

    $headers = array('Content-Type: text/html; charset=UTF-8');
    $message = "Assalamualaikum " . $user->data->user_email . "<br/>
Ahlan wa sahlan.<br/> <br/>
Selamat datang di Tahmeed, Sahabat perencanaan umrah Anda.<br/>
Silahkan klik link dibawah ini untuk memverifikasi akun Anda pada website Tahmeed.id<br/><br/>
<a href=" . get_site_url() . ("/index.php/wp-json/vm/v1/account/verify?key=" . $verifyCode . "&userid=" . $user_id) . ">Klik link berikut untuk verifikasi akun Anda</a><br/><br/>
Barakallahufikum.<br/>
<b>Tahmmed.ID Team</b>";

    wp_mail($user->data->user_email, "Email Verifikasi Tahmeed", $message, $headers);
}

function lost_password_message(){
	return "<strong style='margin-bottom:4px;display:block'>Lupa kata sandi?</strong><span>Silakan isi nama atau alamat email Anda. Kami akan mengirimkan email berisi tautan untuk Anda membuat kata sandi baru.</span>";
}

function lost_password_confirmation_message(){
	return "<span style='font-weight:600;display:block'>Email pengaturan ulang kata sandi akun Anda telah terkirim</span><span>Kami telah mengirimkan email untuk pengaturan ulang kata sandi akun Tahmeed Anda. Mohon tunggu setidaknya 10 menit lagi sebelum mencoba lagi</span>";
}

add_action('user_register', 'sendVerificationEmail');
add_action('woocommerce_lost_password_message','lost_password_message');
add_action('woocommerce_lost_password_confirmation_message','lost_password_confirmation_message');
/** API **/

function verify_account()
{
    $key = $_GET['key'];
    $userid = $_GET['userid'];

    $user = get_user_by('id', $userid);

    $code = get_user_meta($userid, 'tahmeed_verify_code', true);


    if (!$user) {
        header('location:/?register=fail&message=ID User Anda Tidak Valid!');
        exit();
    }

    if ($code == $key) {
        $result = update_user_meta($userid, 'tahmeed_verify_status', 1);		
        header('location:/?register=success&message=Terimakasih! Akun Anda sudah berhasil di verifikasi!');
        exit();
    }

    header('location:/?register=fail&message=Kode Verifikasi Anda Tidak Valid!');
    exit();
}
