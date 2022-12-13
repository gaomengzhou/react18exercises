import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import copy from 'copy-to-clipboard';
import { Toast } from 'antd-mobile';
import { AppDispatch } from '@/redux/store';
import { changeServeStatus } from '@/redux/security';
import { useSelector } from '@/redux/hook';
import styles from './index.module.scss';

const Serve: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const serveName = useSelector((state) => state.security.serveName);
  const close = () => {
    dispatch(changeServeStatus(0));
  };
  const { t } = useTranslation();
  const onCopy = (values: string) => {
    if (copy(values)) {
      Toast.show({ content: t('wallet.copysuccess') });
    } else {
      Toast.show('复制失败');
    }
  };
  return (
    <div className={styles.ReactModalPortal}>
      <div className={styles.ReactModal__Overlay}>
        <div className={styles.ReactModal__Content}>
          <div className={styles.heardtitle}>
            <div>{serveName}</div>
            <div className={styles['hx-modal-title']} onClick={close}></div>
          </div>
          {(serveName === 'Contact us' || serveName === '联系我们') && (
            <div className={styles.bobybox}>
              <div className={styles.contactus}>
                <div className={styles.contactusbox}>
                  <div
                    className={styles.contactusitem}
                    onClick={() => onCopy('Service@bet123.io')}
                  >
                    <img
                      className={styles.iconleft}
                      src={require('@/assets/images/contactus/Email@2x.9b9ffe0c.png')}
                      alt=''
                    />
                    <div className={styles.middle}>
                      <div className={styles.title}>
                        {t('activity.Customerservieemail')}
                      </div>
                      <div className={styles.emailbox}>
                        Service@bet123.io
                        <img
                          src={require('@/assets/images/contactus/do.png')}
                          alt=''
                        />
                      </div>
                    </div>
                    <img
                      className={styles.iconright}
                      src={require('@/assets/images/security/icon-安全中心-进入.png')}
                      alt=''
                    />
                  </div>
                  <div
                    className={styles.contactusitem}
                    onClick={() => window.open('https://t.me/bet123official')}
                  >
                    <img
                      className={styles.iconleft}
                      src={require('@/assets/images/contactus/Telegram@2x.2bf1bd88.png')}
                      alt=''
                    />
                    <div className={styles.middle}>
                      <div className={styles.title}>Telegram</div>
                      <div className={styles.emailbox}>
                        {t('activity.join')}
                      </div>
                    </div>
                    <img
                      className={styles.iconright}
                      src={require('@/assets/images/security/icon-安全中心-进入.png')}
                      alt=''
                    />
                  </div>
                  <div
                    className={styles.contactusitem}
                    onClick={() =>
                      window.open('https://discord.com/invite/Wve27Uyq')
                    }
                  >
                    <img
                      className={styles.iconleft}
                      src={require('@/assets/images/contactus/Discord@2x.24bfaa51.png')}
                      alt=''
                    />
                    <div className={styles.middle}>
                      <div className={styles.title}>Discord</div>
                      <div className={styles.emailbox}>
                        {t('activity.tip2222')}
                      </div>
                    </div>
                    <img
                      className={styles.iconright}
                      src={require('@/assets/images/security/icon-安全中心-进入.png')}
                      alt=''
                    />
                  </div>
                </div>
                <div className={styles.right}>
                  <div className={styles.right_title}>
                    {t('activity.Social')}
                  </div>
                  <div className={styles.right_p}>{t('activity.tip1111')}</div>
                  <div className={styles.right_content}>
                    <div
                      className={styles.right_content_li}
                      onClick={() =>
                        window.open('https://www.facebook.com/bet123official')
                      }
                    >
                      <img
                        src={require('@/assets/images/contactus/Facebook@2x.dccd956b.png')}
                        alt=''
                      />
                      <div className={styles.right_content_li_text}>
                        Facebook
                      </div>
                    </div>
                    <div
                      className={styles.right_content_li}
                      onClick={() =>
                        window.open('https://twitter.com/bet123official')
                      }
                    >
                      <img
                        src={require('@/assets/images/contactus/下载.png')}
                        alt=''
                      />
                      <div className={styles.right_content_li_text}>
                        Twitter
                      </div>
                    </div>
                    <div
                      className={styles.right_content_li}
                      onClick={() =>
                        window.open('https://discord.com/invite/Wve27Uyq')
                      }
                    >
                      <img
                        src={require('@/assets/images/contactus/Discord@2x.24bfaa51.png')}
                        alt=''
                      />
                      <div className={styles.right_content_li_text}>
                        Discord
                      </div>
                    </div>
                    <div
                      className={styles.right_content_li}
                      onClick={() =>
                        window.open(
                          'https://www.youtube.com/channel/UCVvWTkuLHbpzqPiOTC4wTYAhttps://twitter.com/bet123official'
                        )
                      }
                    >
                      <img
                        src={require('@/assets/images/contactus/下载 (1).png')}
                        alt=''
                      />
                      <div className={styles.right_content_li_text}>
                        Youtube
                      </div>
                    </div>

                    {/* <div
                      className={styles.right_content_li}
                      onClick={() =>
                        window.open(
                          'https://www.youtube.com/channel/UCVvWTkuLHbpzqPiOTC4wTYAhttps://twitter.com/bet123official'
                        )
                      }
                    >
                      <img
                        src={require('@/assets/images/contactus/TikTok@2x.12acebe3.png')}
                        alt=''
                      />
                      <div className={styles.right_content_li_text}>TikTok</div>
                    </div> */}
                    <div
                      className={styles.right_content_li}
                      onClick={() =>
                        window.open('https://www.instagram.com/bet123official/')
                      }
                    >
                      <img
                        src={require('@/assets/images/contactus/Insta@2x.4a455cd1.png')}
                        alt=''
                      />
                      <div className={styles.right_content_li_text}>
                        Instagram
                      </div>
                    </div>
                    <div className={styles.right_content_li}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(serveName === '服务条款' || serveName === 'Terms of Service') && (
            <div
              className={styles.bobybox}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: t('activity.TermsofService'),
              }}
            ></div>
          )}
          {(serveName === '关于我们' || serveName === 'About us') && (
            <div
              className={styles.bobybox}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: t('activity.aboutus'),
              }}
            ></div>
          )}

          {(serveName === 'Contact us' || serveName === '联系我们') && (
            <div className={styles.h5container}>
              <div className={styles.contactus}>
                <div className={styles.contactusbox}>
                  <div
                    className={styles.contactusitem}
                    onClick={() => onCopy('Service@bet123.io')}
                  >
                    <img
                      className={styles.iconleft}
                      src={require('@/assets/images/contactus/Email@2x.9b9ffe0c.png')}
                      alt=''
                    />
                    <div className={styles.middle}>
                      <div className={styles.title}>
                        {t('activity.Customerservieemail')}
                      </div>
                      <div className={styles.emailbox}>
                        Service@bet123.io
                        <img
                          src={require('@/assets/images/contactus/do.png')}
                          alt=''
                        />
                      </div>
                    </div>
                    <img
                      className={styles.iconright}
                      src={require('@/assets/images/security/icon-安全中心-进入.png')}
                      alt=''
                    />
                  </div>
                  <div
                    className={styles.contactusitem}
                    onClick={() => window.open('https://t.me/bet123official')}
                  >
                    <img
                      className={styles.iconleft}
                      src={require('@/assets/images/contactus/Telegram@2x.2bf1bd88.png')}
                      alt=''
                    />
                    <div className={styles.middle}>
                      <div className={styles.title}>Telegram</div>
                      <div className={styles.emailbox}>
                        {t('activity.join')}
                      </div>
                    </div>
                    <img
                      className={styles.iconright}
                      src={require('@/assets/images/security/icon-安全中心-进入.png')}
                      alt=''
                    />
                  </div>
                  <div
                    className={styles.contactusitem}
                    onClick={() =>
                      window.open('https://discord.com/invite/Wve27Uyq')
                    }
                  >
                    <img
                      className={styles.iconleft}
                      src={require('@/assets/images/contactus/Discord@2x.24bfaa51.png')}
                      alt=''
                    />
                    <div className={styles.middle}>
                      <div className={styles.title}>Discord</div>
                      <div className={styles.emailbox}>
                        {t('activity.tip2222')}
                      </div>
                    </div>
                    <img
                      className={styles.iconright}
                      src={require('@/assets/images/security/icon-安全中心-进入.png')}
                      alt=''
                    />
                  </div>
                </div>
                <div className={styles.right}>
                  <div className={styles.right_title}>
                    {t('activity.Social')}
                  </div>
                  <div className={styles.right_p}>{t('activity.tip1111')}</div>
                  <div className={styles.right_content}>
                    <div
                      className={styles.right_content_li}
                      onClick={() =>
                        window.open('https://www.facebook.com/bet123official')
                      }
                    >
                      <img
                        src={require('@/assets/images/contactus/Facebook@2x.dccd956b.png')}
                        alt=''
                      />
                      <div className={styles.right_content_li_text}>
                        Facebook
                      </div>
                    </div>
                    <div
                      className={styles.right_content_li}
                      onClick={() =>
                        window.open('https://twitter.com/bet123official')
                      }
                    >
                      <img
                        src={require('@/assets/images/contactus/下载.png')}
                        alt=''
                      />
                      <div className={styles.right_content_li_text}>
                        Twitter
                      </div>
                    </div>
                    <div
                      className={styles.right_content_li}
                      onClick={() =>
                        window.open('https://discord.com/invite/Wve27Uyq')
                      }
                    >
                      <img
                        src={require('@/assets/images/contactus/Discord@2x.24bfaa51.png')}
                        alt=''
                      />
                      <div className={styles.right_content_li_text}>
                        Discord
                      </div>
                    </div>
                    <div
                      className={styles.right_content_li}
                      onClick={() =>
                        window.open(
                          'https://www.youtube.com/channel/UCVvWTkuLHbpzqPiOTC4wTYAhttps://twitter.com/bet123official'
                        )
                      }
                    >
                      <img
                        src={require('@/assets/images/contactus/下载 (1).png')}
                        alt=''
                      />
                      <div className={styles.right_content_li_text}>
                        Youtube
                      </div>
                    </div>
                    {/* <div
                      className={styles.right_content_li}
                      onClick={() =>
                        window.open(
                          'https://www.youtube.com/channel/UCVvWTkuLHbpzqPiOTC4wTYAhttps://twitter.com/bet123official'
                        )
                      }
                    >
                      <img
                        src={require('@/assets/images/contactus/TikTok@2x.12acebe3.png')}
                        alt=''
                      />
                      <div className={styles.right_content_li_text}>TikTok</div>
                    </div> */}
                    <div
                      className={styles.right_content_li}
                      onClick={() =>
                        window.open('https://www.instagram.com/bet123official/')
                      }
                    >
                      <img
                        src={require('@/assets/images/contactus/Insta@2x.4a455cd1.png')}
                        alt=''
                      />
                      <div className={styles.right_content_li_text}>
                        Instagram
                      </div>
                    </div>
                    <div className={styles.right_content_li}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(serveName === '服务条款' || serveName === 'Terms of Service') && (
            <div
              className={styles.h5container}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: t('activity.TermsofService'),
              }}
            ></div>
          )}
          {(serveName === '关于我们' || serveName === 'About us') && (
            <div
              className={styles.h5container}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: t('activity.aboutus'),
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Serve;
