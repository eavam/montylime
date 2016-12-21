<?php

	if ($_POST) { // если передан массив POST

		$phone = htmlspecialchars( trim( $_POST['phone'] ) );

		$success = array();
		if ( empty($phone) ) {
			$success['error'] = "Вы не указали телефон";
			echo json_encode($success);
		} else {

			$to = 'avakymov@yandex.ru';
			$subject = 'Обратный звонок';
			$message = '
			<p><strong>Телефон:</strong> '. $phone .'</p>'.
			'<p><strong>Время отправки:</strong> '. date('d-m-Y h:i', time() + 60 * 60 * 4) .'</p>';

			$headers = "Content-type: text/html; charset=\"utf-8\"";
			mail($to, $subject, $message, $headers);

			$success['good'] = 'Спасибо, мы свяжемся с вами';

			echo json_encode($success);
		}

	} else { // если массив POST не был передан
		$success['error'] = 'Что-то пошло не так... Позвоните мы разберемся.';
		echo json_encode($success);
	}
