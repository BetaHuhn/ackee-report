<div align="center">

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

## ⚙️ Configuration

On the first run [ackee-report](https://github.com/BetaHuhn/ackee-report) will ask you to input a few values:

- *Ackee server* - The endpoint of your Ackee instance
- *Ackee username* - Your Ackee username you use to login to the UI
- *Ackee password* - Your Ackee password you use to login to the UI
- *SMTP host* - the domain of the SMTP server (examples below)
- *SMTP port* - the port of the SMTP server (examples below)
- *SMTP username* - the username to use with the SMPT server (examples below)
- *SMTP password* - tthe password to use with the SMPT server (examples below)
- *SMTP from* - the from address to use (in most cases your own email address)

The configuration will be stored in your home directory under `~/.config/configstore/ackee-report.json` and can be changed at any point.

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
Usage: ackee-report generate [options]

Generates report and sends it via specified service

Options:
  -d, --domain <titles...>  specify domains by title
  -i, --id <ids...>         specify domains by id
  -t, --to <recipient...>   to whom the report should be sent (when using email)
  -o, --output <file>       path to output file (when using json)
  -s, --service <name>      service to use (default: "email")
  -h, --help                display help for command
```

If you want to send the report periodically, you have to setup a cron job which runs the command at a set interval (example below).

## 🛠️ Examples

### Generate a report for one domain and send it via email

```shell
ackee-report generate -d example.com -t hello@example.com
```

This will generate a report for the domain `example.com` and send it via email to `hello@example.com`.

### Multiple domains and recipients

```shell
ackee-report generate -d example.com example2.com -t hello@example.com hey@example2.com
```

### Send the report periodically (cron)

To send a report periodically, for example every month setup a cron job like this:

```shell
0 0 1 * * ackee-report generate -d example.com -t hello@example.com >> /tmp/ackee-report.log 2>&1
```

If you are not familiar with cron, [here's](https://ostechnix.com/a-beginners-guide-to-cron-jobs/) a tutorial on how to get started.

**Note:** You may have to specify the actual path to ackee-report. In that case, replace `ackee-report` in the command above with the output of `which ackee-report`.

To send multiple reports to different people, add them all as seperate cron jobs.

### Output the report to a JSON file

You can also save the report in a JSON file instead of sending it via email:

```shell
ackee-report generate -s json -d example.com -o report.json
```

## 📝 To do

Here is what's currently planned for [ackee-report](https://github.com/BetaHuhn/ackee-report):

- better design/structure of email report
- more customization of data included in report
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
