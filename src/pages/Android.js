import './Android.css';

// const API = 'http://192.168.1.13:3456';
const API = 'http://31.209.145.132:3456';

const Android = () => {
  return (
    <main>
      <p>
        Crowd sourcing is done by taking measurements and sending them using the
        android app.
      </p>

      <p>To get started you can download the APK by scanning the QR code:</p>

      <img
        className='apk-code'
        src={process.env.PUBLIC_URL + 'eddy.png'}
        alt={'http://31.209.145.132:3456/app'}
      />

      <p>Or by clicking the link:</p>

      <p className='apk-link-wrapper'>
        <a className='apk-link' href={`${API}/app`} title='Download Eddy APK'>
          Download Eddy APK
        </a>
      </p>
    </main>
  );
};

export default Android;
