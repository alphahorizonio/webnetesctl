import {
  faArrowLeft,
  faCogs,
  faExclamationCircle,
  faExternalLinkAlt,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal as ModalTmpl, Space } from "antd";
import Animate from "rc-animate";
import { useCallback, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import ResourceEditorTmpl from "./resource-editor";
import { MoreLink } from "./typography";

export interface IEditNodeConfigModalProps {
  open: boolean;
  onDone: (definition: string) => void;
  onCancel: () => void;
  nodeConfig: string;
  skipConfirmation?: boolean;
}

/**
 * EditNodeConfigModal is a universal node configuration editing modal for both workers and managers.
 * By default it asks for confirmation before closing; use the skipConfirmation to skip this step.
 *
 * @param param0 Props
 */
const EditNodeConfigModal: React.FC<IEditNodeConfigModalProps> = ({
  open,
  onDone,
  onCancel,
  nodeConfig,
  skipConfirmation,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const [definition, setDefinition] = useState(nodeConfig);

  const clear = useCallback(
    () =>
      unstable_batchedUpdates(() => {
        setDefinition(nodeConfig);
      }),
    []
  );

  const cancel = useCallback(async () => {
    try {
      if (!skipConfirmation) {
        await new Promise<void>((res, rej) =>
          Modal.confirm({
            centered: true,
            icon: <> </>,
            title: (
              <Space>
                <FontAwesomeIcon icon={faExclamationCircle} />
                {t("discardChangesTitle")}
              </Space>
            ),
            content: t("discardChangesDescription"),
            cancelText: (
              <Space>
                <FontAwesomeIcon icon={faArrowLeft} />
                {t("noKeepChanges")}
              </Space>
            ),
            onCancel() {
              rej();
            },
            okButtonProps: { type: "primary" },
            okText: (
              <Space>
                <FontAwesomeIcon icon={faTrash} />
                {t("yesDiscardChanges")}
              </Space>
            ),
            okType: "danger",
            onOk() {
              res();
            },
          })
        );
      }
    } catch (e) {
      return false;
    }

    clear();

    onCancel();
  }, [definition, skipConfirmation]);

  return (
    <Modal
      title={
        <>
          <Space>
            <FontAwesomeIcon fixedWidth icon={faCogs} />
            <span>{t("nodeConfig")}</span>
          </Space>

          <Button type="text" shape="circle" onClick={() => cancel()}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </>
      }
      centered
      transitionName="fadeandzoom"
      visible={open}
      onOk={() => {
        clear();

        onDone(definition);
      }}
      onCancel={() => cancel()}
      okText={
        <Space>
          <FontAwesomeIcon fixedWidth icon={faCogs} />
          <span>
            {t("useThis")} {t("nodeConfig")}
          </span>
        </Space>
      }
      closable={false}
      {...otherProps}
    >
      <Animate transitionName="fadeandslide" transitionAppear>
        <div>
          <ResourceEditor
            data={definition || ""}
            onEdit={(value) => setDefinition(value)}
          />

          <MoreLink>
            {t("youCanFindAnExampleInThe")}{" "}
            <a
              href="https://github.com/alphahorizonio/webnetes/blob/main/app/webnetes_node/node.yaml"
              target="_blank"
            >
              GitHub Repository <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
            .
          </MoreLink>
        </div>
      </Animate>
    </Modal>
  );
};

const Modal = styled(ModalTmpl)`
  min-width: 80vw;

  .ant-modal-content {
    border: 0;
    box-shadow: none;
  }

  .ant-modal-header,
  .ant-modal-content {
    background: transparent;
  }

  .ant-modal-header {
    padding-right: 16px;
  }

  .ant-modal-title {
    display: flex;
    justify-content: space-between;
  }

  .ant-modal-body {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

const ResourceEditor = styled(ResourceEditorTmpl)`
  margin-left: -24px;
  margin-right: -24px;
  min-height: 60vh;
`;

export default EditNodeConfigModal;
