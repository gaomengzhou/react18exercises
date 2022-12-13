import { FC } from 'react';
import { Divider, Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import styles from './DividerPart.module.scss';

interface TypeText {
  text: string;
}
const DividerPart: FC<TypeText> = ({ text }) => {
  const { t } = useTranslation();
  const routerThirdLogin = () => {
    Toast.show(t('login.Notyetopenstaytuned'));
  };
  return (
    <div className={styles.dividerPart}>
      <div className={styles.dividerWrap}>
        <Divider
          style={{
            width: '100%',
            borderColor: '#3a3939',
          }}
        >
          {text}
        </Divider>
      </div>

      <div className={styles.thridLogin}>
        <span className={styles.googleLogin} onClick={routerThirdLogin}></span>
        <span className={styles.thridText}> Google</span>
        <span className={styles.metaLogin} onClick={routerThirdLogin}></span>
        <span className={styles.thridText}> Metamask</span>
      </div>
    </div>
  );
};

export default DividerPart;
