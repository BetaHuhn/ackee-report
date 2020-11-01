<div align="center">
  
<img src="https://cdn.mxis.ch/assets/ackee-report/logo.png" title="ackee-report" alt="ackee-report logo" width="128">

# ackee-report

[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/BetaHuhn/ackee-report/blob/master/LICENSE) ![David](https://img.shields.io/david/betahuhn/ackee-report) [![npm](https://img.shields.io/npm/v/ackee-report)](https://www.npmjs.com/package/ackee-report)

CLI tool to generate performance reports of websites using the self-hosted analytics tool Ackee.

![preview](https://cdn.mxis.ch/assets/ackee-report/mockupSmall.png)


</div>

## 👋 Introduction

[ackee-report](https://github.com/BetaHuhn/ackee-report) lets you create monthly website performance reports using your [Ackee](https://github.com/electerious/ackee) analytics data and deliver them to multiple recipients via email. It uses [Ackee's](https://github.com/electerious/ackee) Graphql API and can be configured to send multiple reports for different websites and recipients.

## 🚀 Get started

Install [ackee-report](https://github.com/BetaHuhn/ackee-report) globally via npm:
```shell
npm install ackee-report -g
```

After that `ackee-report` is ready to be used 🎉

## ⚙️ Configuration

On the first run [ackee-report](https://github.com/BetaHuhn/ackee-report) will ask you to input a few values:

- *ackee server* - the endpoint of your Ackee instance
- *ackee token* - a permanent Ackee token (can be used instead of username and password, [more info](#ackee-api-authentication))
- *ackee username* - your Ackee username ([more info](#ackee-api-authentication))
- *ackee password* - your Ackee password ([more info](#ackee-api-authentication))
- *email host* - the domain of the email server ([more info](#email-setup))
- *email port* - the port of the email server ([more info](#email-setup))
- *email username* - the username to use with the email server ([more info](#email-setup))
- *email password* - the password to use with the email server ([more info](#email-setup))
- *email from* - the from address to use ([more info](#email-setup))

The configuration will be stored in your home directory under `~/.config/configstore/ackee-report.json` and can be changed at any point.

### Ackee API authentication

[ackee-report](https://github.com/BetaHuhn/ackee-report) needs access to your Ackee instance via the API in order to get all the data it needs to generate the report. You can choose any of the two authentication methods below:

**Username and password:**

Enter your username and password you use to login to the Ackee UI on the first run of [ackee-report](https://github.com/BetaHuhn/ackee-report) or change it in the config file later.

[ackee-report](https://github.com/BetaHuhn/ackee-report) will then use them to create a temporary access token each time it runs and use it to query the Ackee API.

**Permanent access token (recommended):**

The recommended way of authenticating [ackee-report](https://github.com/BetaHuhn/ackee-report) is with a permanent access token. 

You will have to create one via the Ackee UI under `Settings`/`Permanent Tokens`, then click on `New permanent token` and give it a name (doesn't matter what).

Copy the `permanent token id` and enter it on the first run of [ackee-report](https://github.com/BetaHuhn/ackee-report) or add it to the config file under `ackee.token` later.

The same token will then be used each time [ackee-report](https://github.com/BetaHuhn/ackee-report) runs to query the Ackee API.

### Email setup

If you want to send your report via email, you have to specify your email providers SMTP server and credentials, aswell as the from option:

- *Host* - `smtp.example.com`
- *Port* - `465`
- *Username* - `username@example.com`
- *Password* - `password`
- *From* - `username@example.com` or `Ackee <username@example.com>`

Common providers:

<details><summary>Gmail</summary>

If you use gmail to send emails, use these values:

- *Host* - `smtp.gmail.com`
- *Port* - `465`
- *Username* -  your gmail username (your email address)
- *Password* -  your gmail password or if you have 2FA enabled, an ["Application Specific password"](https://security.google.com/settings/security/apppasswords)

</details>

<details><summary>SendGrid</summary>

If you use SendGrid to send emails, use these values:

- *Host* - `smtp.sendgrid.net`
- *Port* - `465`
- *Username* -  `apikey` (everyone's username is apiKey)
- *Password* - your API Key (generate one [here](https://app.sendgrid.com/settings/api_keys))
</details>

<details><summary>MailGun</summary>

If you use SendGrid to send emails, use these values:

- *Host* - `smtp.mailgun.org`
- *Port* - `465`
- *Username* -  `postmaster@yourdomain.name`
- *Password* - get your password [here](https://app.mailgun.com/app/domains)

</details>

## 📚 Usage

```shell
Usage: ackee-report email [options]

Generate report and send it via email

Options:
  -d, --domain <titles...>  specify domains by title
  -i, --id <ids...>         specify domains by id
  -t, --to <recipient...>   to whom the report should be sent
  -s, --style <name>        email style to use (default: "ackee")
  -h, --help                display help for command
```

If you want to send the report periodically, you have to setup a cron job which runs the command at a set interval (example below).

## 🛠️ Examples

### Generate a report for one domain and send it via email

```shell
ackee-report email -d example.com -t hello@example.com
```

This will generate a report for the domain `example.com` and send it via email to `hello@example.com`.

### Multiple domains and recipients

```shell
ackee-report email -d example.com example2.com -t hello@example.com hey@example2.com
```

### Send the report periodically (cron)

To send a report periodically, for example every month setup a cron job like this:

```shell
0 0 1 * * ackee-report email -d example.com -t hello@example.com >> /tmp/ackee-report.log 2>&1
```

If you are not familiar with cron, [here's](https://ostechnix.com/a-beginners-guide-to-cron-jobs/) a tutorial on how to get started.

**Note:** You may have to specify the actual path to ackee-report. In that case, replace `ackee-report` in the command above with the output of `which ackee-report`.

To send multiple reports to different people, add them all as seperate cron jobs.

### Output the report to a JSON file

You can also save the report in a JSON file instead of sending it via email:

```shell
ackee-report json -d example.com -o output.json
```

## 🖼️ Screenshot

![preview](https://cdn.mxis.ch/assets/ackee-report/multiple.png)

## 📝 To do

Here is what's currently planned for [ackee-report](https://github.com/BetaHuhn/ackee-report):

- more customization of data included in report
- display data with charts
- change config file via cli
- add more services (e.g. Telegram)

## 💻 Development

Issues and PRs are very welcome!

Run `yarn lint` or `npm run lint` to use eslint.

Please check out the [contributing guide](CONTRIBUTING.md) before you start.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). To see differences with previous versions refer to the [CHANGELOG](CHANGELOG.md).

## ❔ About

This library is an extension to the awesome privacy focused analytics tool [Ackee](https://github.com/electerious/ackee).

[Ackee](https://github.com/electerious/ackee) was developed by [@electerious](https://github.com/electerious), if you want to support him and the development of Ackee visit [the Donate section](https://github.com/electerious/ackee#donate) on the Ackee repository.

## License

Copyright 2020 Maximilian Schiller

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
