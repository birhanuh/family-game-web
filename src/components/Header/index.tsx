import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Layout, MenuProps } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";

const { Header } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: 'Games',
    key: 'games',
    icon:  <PlayCircleOutlined key="games" />,
  },
  // {
  //   label: 'Navigation Two',
  //   key: 'app',
  //   icon: <AppstoreOutlined />,
  //   disabled: true,
  // },
  // {
  //   key: 'alipay',
  //   label: (
  //     <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
  //       Navigation Four - Link
  //     </a>
  //   ),
  // },
];

export const HeaderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const params = useParams();

  const onClick: MenuProps['onClick'] = () => {
    navigate('/');
  };

  return (
    <Header>
      <Link to="/" className="logo"> 
        <div className="logo" />
      </Link>
      <Menu onClick={onClick} selectedKeys={[ location.pathname === '/' || location.pathname?.startsWith('/games') ? 'games' : '']} mode="horizontal" items={items} />
    </Header>
  );
}
